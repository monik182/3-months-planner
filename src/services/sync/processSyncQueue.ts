import { QueueEntityType, QueueOperation, QueueStatus } from '@/app/types/types'
import { dexieToPlan } from '@/app/util'
import { syncQueueHandler } from '@/db/dexieHandler'
import { SyncService } from '@/services/sync'
import { validateUserExists } from '@/services/sync/shared'

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
      .and(item => item.attempts < 3)
      .toArray()

    // Group items by entity type and ID to detect duplicates
    const uniqueItems = new Map()
    for (const item of items) {
      const key = `${item.entityType}:${item.entityId}:${item.operation}`

      // Keep only the most recent item for each entity
      if (!uniqueItems.has(key) || uniqueItems.get(key).timestamp < item.timestamp) {
        uniqueItems.set(key, item)
      }
    }

    // Sort items to ensure correct dependency order
    const sorted = Array.from(uniqueItems.values()).sort((a, b) => {
      const order = { user: 0, plan: 1, goal: 2, strategy: 3, indicator: 3 }
      const aOrder = order[a.entityType as keyof typeof order] || 99
      const bOrder = order[b.entityType as keyof typeof order] || 99

      // If same entity type, process oldest first
      if (aOrder === bOrder) {
        return a.timestamp - b.timestamp
      }

      return aOrder - bOrder
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

        // Handle entity dependencies
        let canProceed = true

        if (item.entityType === QueueEntityType.PLAN &&
          (item.operation === QueueOperation.CREATE || item.operation === QueueOperation.UPDATE)) {
          // Ensure user exists
          const userId = item.payload.userId
          const userExists = await validateUserExists(userId)

          if (!userExists) {
            console.error(`User ${userId} does not exist - cannot process plan ${item.entityId}`)
            canProceed = false
          }
        } else if ((item.entityType !== QueueEntityType.PLAN) &&
          (item.operation === QueueOperation.CREATE || item.operation === 'update')) {
          // Ensure plan exists
          const planId = item.entityId === 'bulk' || !item.entityId ? item.payload[0].planId : item.payload.planId
          try {
            const planResponse = await fetch(`/api/plan/${planId}`)
            if (!planResponse.ok) {
              // We'll retry this item later when the plan is synced
              await syncQueueHandler.update(item.id!, {
                status: QueueStatus.PENDING,
                error: `Waiting for plan ${planId} to be synced first`
              })
              continue // Skip to next item
            }
          } catch (error) {
            // Network error, possibly offline - we'll try again later
            await syncQueueHandler.update(item.id!, {
              status: QueueStatus.PENDING,
              error: `Network error checking plan: ${error instanceof Error ? error.message : 'Unknown error'}`
            })
            continue // Skip to next item
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

          response = await fetch(apiUrl, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: method !== 'DELETE' ? JSON.stringify(payload) : undefined,
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
            continue // Skip to next item
          }
          throw error // Re-throw other errors to be caught by the outer try/catch
        }

        // Mark item as completed
        await syncQueueHandler.update(item.id!, { status: QueueStatus.COMPLETED })
        processed++
      } catch (error) {
        console.error(`Error processing ${item.entityType} ${item.entityId}:`, error)

        // Update item status to failed
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


const getApiUrlForEntity = (entityType: QueueEntityType, entityId: string, operation: QueueOperation): string | null => {
  switch (entityType) {
    case QueueEntityType.USER:
      return operation === QueueOperation.CREATE ? '/api/user' : `/api/user/${entityId}`
    case QueueEntityType.PLAN:
      return operation === QueueOperation.CREATE ? '/api/plan/' : `/api/plan/${entityId}`
    case QueueEntityType.GOAL:
      return operation === QueueOperation.CREATE ? '/api/goal' : `/api/goal/${entityId}`
    case QueueEntityType.GOAL_BULK:
      return operation === QueueOperation.CREATE ? '/api/goal/bulk' : null
    case QueueEntityType.GOAL_HISTORY:
      return operation === QueueOperation.CREATE ? '/api/goal/history' : `/api/goal/history/${entityId}`
    case QueueEntityType.GOAL_HISTORY_BULK:
      return operation === QueueOperation.CREATE ? '/api/goal/history/bulk' : null
    case QueueEntityType.STRATEGY:
      return operation === QueueOperation.CREATE ? '/api/strategy' : `/api/strategy/${entityId}`
    case QueueEntityType.STRATEGY_BULK:
      return operation === QueueOperation.CREATE ? '/api/strategy/bulk' : null
    case QueueEntityType.STRATEGY_HISTORY:
      return operation === QueueOperation.CREATE ? '/api/strategy/history' : `/api/strategy/history/${entityId}`
    case QueueEntityType.STRATEGY_HISTORY_BULK:
      return operation === QueueOperation.CREATE ? '/api/strategy/history/bulk' : null
    case QueueEntityType.INDICATOR:
      return operation === QueueOperation.CREATE ? '/api/indicator' : `/api/indicator/${entityId}`
    case QueueEntityType.INDICATOR_BULK:
      return operation === QueueOperation.CREATE ? '/api/indicator/bulk' : null
    case QueueEntityType.INDICATOR_HISTORY:
      return operation === QueueOperation.CREATE ? '/api/indicator/history' : `/api/indicator/history/${entityId}`
    case QueueEntityType.INDICATOR_HISTORY_BULK:
      return operation === QueueOperation.CREATE ? '/api/indicator/history/bulk' : null
    default:
      return null
  }
}

const getMethodForOperation = (operation: string): string => {
  switch (operation) {
    case QueueOperation.DELETE:
      return 'DELETE'
    case QueueOperation.UPDATE:
      return 'PUT'
    default:
      return 'POST'
  }
}

const preparePayloadForSync = (entityType: QueueEntityType, payload: any): any => {
  switch (entityType) {
    case QueueEntityType.PLAN:
      return dexieToPlan(payload)
    default:
      return payload
  }
}
