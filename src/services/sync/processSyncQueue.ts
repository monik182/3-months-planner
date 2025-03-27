import { QueueEntityType, QueueOperation, QueueStatus } from '@/app/types/types'
import { syncQueueHandler } from '@/db/dexieHandler'
import { SyncService } from '@/services/sync'
import { getApiUrlForEntity, getBulkEntityType, getMethodForOperation, preparePayloadForSync, validateUserExists } from '@/services/sync/shared'

export const processSyncQueue = async () => {
  if (!SyncService.isEnabled) return { success: true, processed: 0, failed: 0 }

  try {
    const stuckItems = await syncQueueHandler.findByStatus(QueueStatus.PROCESSING)

    if (stuckItems.length > 0) {
      await Promise.all(stuckItems.map(item =>
        syncQueueHandler.update(item.id!.toString(), {
          status: QueueStatus.PENDING,
          error: 'Item was stuck in processing state and was reset'
        })
      ))
    }

    const items = await syncQueueHandler.table
      .where('status')
      .anyOf(QueueStatus.PENDING, QueueStatus.FAILED)
      .and(item => item.attempts < 5)
      .toArray()

    const uniqueItems = new Map()

    const createOperationsByType = new Map()
    const deleteOperationsByType = new Map()

    for (const item of items) {
      if (item.operation === QueueOperation.CREATE) {
        const entityType = item.entityType

        if (!createOperationsByType.has(entityType)) {
          createOperationsByType.set(entityType, [])
        }

        createOperationsByType.get(entityType).push(item)
      } else if (item.operation === QueueOperation.DELETE) {
        const entityType = item.entityType

        if (!deleteOperationsByType.has(entityType)) {
          deleteOperationsByType.set(entityType, [])
        }

        deleteOperationsByType.get(entityType).push(item)
      }
    }

    // Process CREATE operations - combine into bulk where possible
    for (const [entityType, createItems] of createOperationsByType.entries()) {
      if (createItems.length > 1) {
        const bulkEntityType = getBulkEntityType(entityType)

        if (bulkEntityType) {
          const mostRecentCreate = createItems.reduce(
            (prev: any, current: any) => (prev.timestamp > current.timestamp) ? prev : current
          )

          // Create a bulk operation
          const bulkPayload = createItems.map((item: any) => item.payload)
          const bulkItem = {
            ...mostRecentCreate,
            id: mostRecentCreate.id,
            entityType: bulkEntityType,
            entityId: 'bulk',
            payload: bulkPayload,
            operation: QueueOperation.CREATE
          }

          // Add the bulk item to uniqueItems
          const bulkKey = `${bulkItem.entityType}:${bulkItem.entityId}:${bulkItem.operation}`
          uniqueItems.set(bulkKey, bulkItem)

          // Keep track of which individual items are now part of bulk
          for (const item of createItems) {
            // Mark this item as processed by adding to a set or map
            const key = `${item.entityType}:${item.entityId}:${item.operation}`
            await syncQueueHandler.update(item.id!, { status: QueueStatus.COMPLETED })
            console.log(`Item ${key} included in bulk operation`)
          }
        } else {
          // If bulk not supported, add each CREATE individually
          for (const item of createItems) {
            const key = `${item.entityType}:${item.entityId}:${item.operation}`
            uniqueItems.set(key, item)
          }
        }
      } else if (createItems.length === 1) {
        // Only one CREATE, add it directly
        const item = createItems[0]
        const key = `${item.entityType}:${item.entityId}:${item.operation}`
        uniqueItems.set(key, item)
      }
    }

    // Process DELETE operations - combine into bulk where possible
    for (const [entityType, deleteItems] of deleteOperationsByType.entries()) {
      if (deleteItems.length > 1) {
        const bulkEntityType = getBulkEntityType(entityType)

        if (bulkEntityType) {
          const mostRecentDelete = deleteItems.reduce(
            (prev: any, current: any) => (prev.timestamp > current.timestamp) ? prev : current
          )

          // Group deletions by planId if available
          const deletesByPlanId = new Map()

          for (const item of deleteItems) {
            // Try to get planId from payload or entityId
            let planId = null

            if (item.payload && item.payload.planId) {
              planId = item.payload.planId
            } else if (item.entityId && item.entityId !== 'bulk') {
              // For some entities, we need to extract planId from related records
              // This would require additional DB queries which might be complex
              // For now, we'll use a simplified approach of grouping by entity type
              planId = 'default'
            }

            if (planId) {
              if (!deletesByPlanId.has(planId)) {
                deletesByPlanId.set(planId, [])
              }
              deletesByPlanId.get(planId).push(item)
            }
          }

          // Create bulk delete operations for each planId group
          for (const [planId, itemsInPlan] of deletesByPlanId.entries()) {
            if (itemsInPlan.length > 1) {
              // Get all entity IDs to delete
              const entityIds = itemsInPlan.map((item: any) => item.entityId)

              // Create a bulk delete operation
              const bulkDeleteItem = {
                ...mostRecentDelete,
                id: mostRecentDelete.id,
                entityType: bulkEntityType,
                entityId: 'bulk',
                payload: entityIds,
                operation: QueueOperation.DELETE
              }

              // Add to uniqueItems
              const bulkKey = `${bulkDeleteItem.entityType}:${planId}:${bulkDeleteItem.operation}`
              uniqueItems.set(bulkKey, bulkDeleteItem)

              // Mark individual items as completed
              for (const item of itemsInPlan) {
                await syncQueueHandler.update(item.id!, { status: QueueStatus.COMPLETED })
                console.log(`Delete item ${item.entityType}:${item.entityId} included in bulk delete operation`)
              }
            } else if (itemsInPlan.length === 1) {
              // Only one DELETE for this plan, add it directly
              const item = itemsInPlan[0]
              const key = `${item.entityType}:${item.entityId}:${item.operation}`
              uniqueItems.set(key, item)
            }
          }
        } else {
          // If bulk delete not supported, add each DELETE individually
          for (const item of deleteItems) {
            const key = `${item.entityType}:${item.entityId}:${item.operation}`
            uniqueItems.set(key, item)
          }
        }
      } else if (deleteItems.length === 1) {
        // Only one DELETE, add it directly
        const item = deleteItems[0]
        const key = `${item.entityType}:${item.entityId}:${item.operation}`
        uniqueItems.set(key, item)
      }
    }

    // Process UPDATE operations - merge updates for the same entity
    const updatesByEntityId = new Map()

    for (const item of items) {
      if (item.operation === QueueOperation.UPDATE) {
        const key = `${item.entityType}:${item.entityId}`

        if (!updatesByEntityId.has(key)) {
          updatesByEntityId.set(key, [])
        }

        updatesByEntityId.get(key).push(item)
      }
    }

    // Merge updates for each entity
    for (const [, updates] of updatesByEntityId.entries()) {
      if (updates.length > 0) {
        // Sort updates by timestamp, oldest first
        updates.sort((a: any, b: any) => a.timestamp - b.timestamp)

        // Start with the oldest payload and merge the newer ones
        let mergedPayload = { ...updates[0].payload }
        for (let i = 1; i < updates.length; i++) {
          mergedPayload = { ...mergedPayload, ...updates[i].payload }
        }

        // Create a merged update item based on the newest item
        const newestUpdate = updates[updates.length - 1]
        const mergedItem = {
          ...newestUpdate,
          payload: mergedPayload
        }

        // Add to uniqueItems
        const updateKey = `${newestUpdate.entityType}:${newestUpdate.entityId}:${newestUpdate.operation}`
        uniqueItems.set(updateKey, mergedItem)
      }
    }

    // Create an entity dependency map to track entities by ID
    const entitiesByIdMap = new Map()
    for (const item of Array.from(uniqueItems.values())) {
      const baseEntityType = item.entityType.replace(/_BULK|_HISTORY|_HISTORY_BULK/g, '')

      // Handle both single items and bulk operations
      if (item.entityType.includes('_BULK') && Array.isArray(item.payload)) {
        // For bulk operations, track each entity within the bulk
        for (const entity of item.payload) {
          if (entity.id) {
            entitiesByIdMap.set(`${baseEntityType}:${entity.id}`, item)
          }
        }
      } else {
        // For single entity operations
        if (item.entityId && item.entityId !== 'bulk') {
          entitiesByIdMap.set(`${baseEntityType}:${item.entityId}`, item)
        }
      }
    }

    // Sort items to ensure correct dependency and operation order
    const sorted = Array.from(uniqueItems.values()).sort((a, b) => {
      // First sort by entity type hierarchy
      const typeOrder = { user: 0, plan: 1 }
      const aType = a.entityType.replace(/_BULK|_HISTORY|_HISTORY_BULK/g, '') as keyof typeof typeOrder
      const bType = b.entityType.replace(/_BULK|_HISTORY|_HISTORY_BULK/g, '') as keyof typeof typeOrder
      const aTypeOrder = typeOrder[aType] || 99
      const bTypeOrder = typeOrder[bType] || 99

      if (aTypeOrder !== bTypeOrder) {
        return aTypeOrder - bTypeOrder
      }

      // Then sort by operation: CREATE first, then UPDATE, then DELETE
      const opOrder = {
        [QueueOperation.CREATE]: 1,
        [QueueOperation.UPDATE]: 2,
        [QueueOperation.DELETE]: 3
      }
      const aOpOrder = opOrder[a.operation as keyof typeof opOrder] || 0
      const bOpOrder = opOrder[b.operation as keyof typeof opOrder] || 0

      if (aOpOrder !== bOpOrder) {
        return aOpOrder - bOpOrder
      }

      // If same entity type and operation, process oldest first
      return a.timestamp - b.timestamp
    })

    let processed = 0
    let failed = 0

    // Process each item
    for (const item of sorted) {
      try {
        await syncQueueHandler.update(item.id!, {
          status: QueueStatus.PROCESSING,
          attempts: item.attempts + 1
        })

        let canProceed = true

        if (item.entityType === QueueEntityType.PLAN &&
          (item.operation === QueueOperation.CREATE || item.operation === QueueOperation.UPDATE)) {

          const userId = item.payload.userId
          const userExists = await validateUserExists(userId)

          if (!userExists) {
            console.error(`User ${userId} does not exist - cannot process plan ${item.entityId}`)
            canProceed = false
          }
        } else if ((item.entityType !== QueueEntityType.PLAN) &&
          (item.operation === QueueOperation.CREATE || item.operation === QueueOperation.UPDATE)) {
          // Ensure plan exists
          const planId = item.entityId === 'bulk' || !item.entityId ?
            (Array.isArray(item.payload) ? item.payload[0].planId : item.payload.planId) :
            item.payload.planId

          if (!planId) continue

          try {
            const planResponse = await fetch(`/api/plan/${planId}`)
            if (!planResponse.ok) {
              // Add exponential backoff
              const retryAfter = Math.min(1000 * Math.pow(2, item.attempts), 30000) // Max 30 seconds
              await syncQueueHandler.update(item.id!, {
                status: QueueStatus.PENDING,
                error: `Waiting for plan ${planId} to be synced first`,
                timestamp: Date.now() + retryAfter // Delay next attempt
              })
              continue
            }
          } catch (error) {
            // Network error, possibly offline - we'll try again later
            await syncQueueHandler.update(item.id!, {
              status: QueueStatus.PENDING,
              error: `Network error checking plan: ${error instanceof Error ? error.message : 'Unknown error'}`
            })
            continue
          }
        }

        if (!canProceed) {
          await syncQueueHandler.update(item.id!, {
            status: QueueStatus.FAILED,
            error: 'Cannot proceed due to missing dependencies'
          })
          failed++
          continue
        }

        // Process the item based on entity type
        let response: Response
        const apiUrl = getApiUrlForEntity(item.entityType, item.entityId, item.operation)

        if (!apiUrl) {
          throw new Error(`Unsupported entity type or operation: ${item.entityType} - ${item.operation}`)
        }

        try {
          const method = getMethodForOperation(item.operation)
          const payload = preparePayloadForSync(item.entityType, item.payload)
          console.log(`Processing ${item.entityType} ${item.entityId} (${item.operation})`, method)

          response = await fetch(apiUrl, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: method !== 'DELETE' || item.entityId === 'bulk' ? JSON.stringify(payload) : undefined,
          })

          if (!response.ok) {
            const errorText = await response.text()
            let errorJson
            try {
              errorJson = JSON.parse(errorText)
            } catch {
              // Not JSON
            }

            throw new Error(
              errorJson?.message ||
              errorJson?.error ||
              `Server responded with status ${response.status}: ${errorText || 'No details'}`
            )
          }
        } catch (error) {
          if (error instanceof TypeError && error.message.includes('fetch')) {
            // Network error, possibly offline
            await syncQueueHandler.update(item.id!, {
              status: QueueStatus.PENDING,
              error: `Network error: ${error.message}`
            })
            continue
          }
          throw error
        }

        await syncQueueHandler.update(item.id!, {
          status: QueueStatus.COMPLETED,
          error: undefined
        })
        processed++
      } catch (error) {
        console.error(`Error processing ${item.entityType} ${item.entityId}:`, error)

        await syncQueueHandler.update(item.id!, {
          status: QueueStatus.FAILED,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        failed++
      }
    }

    return { success: true, processed, failed }
  } catch (error) {
    console.error('Error processing sync queue:', error)
    return { success: false, processed: 0, failed: 0 }
  }
}
