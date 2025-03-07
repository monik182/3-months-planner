import { ENABLE_CLOUD_SYNC } from '@/app/constants'
import { SyncQueueItem } from '@/app/types/types'
import { dexieToPlan } from '@/app/util'
import { goalHandler, goalHistoryHandler, indicatorHandler, indicatorHistoryHandler, planHandler, strategyHandler, strategyHistoryHandler, syncQueueHandler, userPreferencesHandler } from '@/db/dexieHandler'
import { UserService } from '@/services/user'

const queueForSync = async (
  entityType: string,
  entityId: string,
  operation: SyncQueueItem['operation'],
  payload: any,
): Promise<number | undefined> => {

  if (!SyncService.isEnabled) {
    return undefined
  }

  return syncQueueHandler.create({
    entityType,
    entityId,
    operation,
    payload,
    status: 'pending',
    attempts: 0,
    timestamp: Date.now()
  })
}

const getSyncQueueStatus = async (): Promise<{
  pending: number,
  processing: number,
  failed: number,
  total: number,
}> => {
  const pending = await syncQueueHandler.countByStatus('pending')
  const processing = await syncQueueHandler.countByStatus('processing')
  const failed = await syncQueueHandler.countByStatus('failed')
  const total = await syncQueueHandler.table.count()

  return { pending, processing, failed, total }
}

const processSyncQueue = async () => {
  if (!SyncService.isEnabled) return { success: true, processed: 0, failed: 0 }

  try {
    const stuckItems = await syncQueueHandler.findByStatus('processing')

    if (stuckItems.length > 0) {
      console.log(`Found ${stuckItems.length} items stuck in processing state, resetting...`)
      await Promise.all(stuckItems.map(item =>
        syncQueueHandler.update(item.id!.toString(), {
          status: 'pending',
          error: 'Item was stuck in processing state and was reset'
        })
      ))
    }

    const items = await syncQueueHandler.table
      .where('status')
      .anyOf('pending', 'failed')
      .and(item => item.attempts < 5)
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

    console.log(`Processing ${sorted.length} unique items (from ${items.length} total queue items)`)

    let processed = 0
    let failed = 0

    // Process each item
    for (const item of sorted) {
      try {
        console.log(`Processing ${item.operation} for ${item.entityType} ${item.entityId}`)
        // Update item status to processing
        await syncQueueHandler.update(item.id!, {
          status: 'processing',
          attempts: item.attempts + 1
        })

        // Handle entity dependencies
        let canProceed = true

        if (item.entityType === 'plan' &&
          (item.operation === 'create' || item.operation === 'update')) {
          // Ensure user exists
          const userId = item.payload.userId
          const userExists = await ensureUserExists(userId)

          if (!userExists) {
            console.error(`User ${userId} does not exist - cannot process plan ${item.entityId}`)
            canProceed = false
          }
        } else if ((item.entityType !== 'plan') &&
          (item.operation === 'create' || item.operation === 'update')) {
          // Ensure plan exists
          const planId = item.entityId === 'bulk' || !item.entityId ? item.payload[0].planId : item.payload.planId
          try {
            const planResponse = await fetch(`/api/plan/${planId}`)
            if (!planResponse.ok) {
              console.log(`Plan ${planId} not yet synced - deferring ${item.entityType} ${item.entityId}`)
              // We'll retry this item later when the plan is synced
              await syncQueueHandler.update(item.id!, {
                status: 'pending',
                error: `Waiting for plan ${planId} to be synced first`
              })
              continue // Skip to next item
            }
          } catch (error) {
            // Network error, possibly offline - we'll try again later
            await syncQueueHandler.update(item.id!, {
              status: 'pending',
              error: `Network error checking plan: ${error instanceof Error ? error.message : 'Unknown error'}`
            })
            continue // Skip to next item
          }
        }

        if (!canProceed) {
          await syncQueueHandler.update(item.id!, {
            status: 'failed',
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

          console.log(`Sending ${method} request to ${apiUrl}`)

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
              status: 'pending',
              error: `Network error: ${error.message}`
            })
            continue // Skip to next item
          }
          throw error // Re-throw other errors to be caught by the outer try/catch
        }

        // Mark item as completed
        await syncQueueHandler.update(item.id!, { status: 'completed' })
        processed++

        console.log(`Successfully processed ${item.entityType} ${item.entityId}`)
      } catch (error) {
        console.error(`Error processing ${item.entityType} ${item.entityId}:`, error)

        // Update item status to failed
        await syncQueueHandler.update(item.id!, {
          status: 'failed',
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

const getApiUrlForEntity = (entityType: string, entityId: string, operation: string): string | null => {
  switch (entityType) {
    case 'user':
      return operation === 'create' ? '/api/user' : `/api/user/${entityId}`
    case 'plan':
      return operation === 'create' ? '/api/plan/' : `/api/plan/${entityId}`
    case 'goal':
      return operation === 'create' ? '/api/goal' : `/api/goal/${entityId}`
    case 'goalBulk':
      return operation === 'create' ? '/api/goal/bulk' : null
    case 'strategy':
      return operation === 'create' ? '/api/strategy' : `/api/strategy/${entityId}`
    case 'strategyBulk':
      return operation === 'create' ? '/api/strategy/bulk' : null
    case 'indicator':
      return operation === 'create' ? '/api/indicator' : `/api/indicator/${entityId}`
    case 'indicatorBulk':
      return operation === 'create' ? '/api/indicator/bulk' : null
    case 'goalHistory':
      return operation === 'create' ? '/api/goal/history' : `/api/goal/history/${entityId}`
    case 'goalHistoryBulk':
      return operation === 'create' ? '/api/goal/history/bulk' : null
    case 'strategyHistory':
      return operation === 'create' ? '/api/strategy/history' : `/api/strategy/history/${entityId}`
    case 'strategyHistoryBulk':
      return operation === 'create' ? '/api/strategy/history/bulk' : null
    case 'indicatorHistory':
      return operation === 'create' ? '/api/indicator/history' : `/api/indicator/history/${entityId}`
    case 'indicatorHistoryBulk':
      return operation === 'create' ? '/api/indicator/history/bulk' : null
    default:
      return null
  }
}

const getMethodForOperation = (operation: string): string => {
  switch (operation) {
    case 'delete':
      return 'DELETE'
    default:
      return 'POST'
  }
}

const preparePayloadForSync = (entityType: string, payload: any): any => {
  switch (entityType) {
    case 'plan':
      return dexieToPlan(payload)
    default:
      return payload
  }
}

const markUserAsSynced = async (userId: string) => {
  const timestamp = Date.now()

  const existing = await userPreferencesHandler.findOne(userId)

  if (existing) {
    await userPreferencesHandler.update(userId, {
      hasSynced: true,
      lastSyncTime: timestamp
    })
  } else {
    await userPreferencesHandler.create({
      userId,
      hasSynced: true,
      lastSyncTime: timestamp
    })
  }

  return timestamp
}

const ensureUserExists = async (userId: string): Promise<boolean> => {
  if (!SyncService.isEnabled) return true

  try {
    const response = await UserService.getRemoteById(userId)

    if (response) {
      return true
    }

    const localUser = await UserService.getLocal()
    if (!localUser) {
      console.error(`User with ID ${userId} not found locally`)
      return false
    }

    try {
      await UserService.create(localUser)
    } catch (error) {
      console.error('Failed to create user in database:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error ensuring user exists:', error)
    return false
  }
}

const syncAllData = async (userId: string, operation: SyncQueueItem['operation'] = 'update'): Promise<{
  success: boolean,
  error?: string
}> => {
  if (!SyncService.isEnabled) {
    return { success: true }
  }

  try {
    const userExists = await ensureUserExists(userId)

    if (!userExists) {
      return {
        success: false,
        error: `User with ID ${userId} could not be created in the database`
      }
    }

    const plans = await planHandler.findOneByUserId(userId)

    for (const plan of plans) {
      await queueForSync('plan', plan.id, operation, plan)

      const goals = await goalHandler.findMany({ planId: plan.id })
      await queueForSync('goalBulk', 'bulk', operation, goals)

      const strategies = await strategyHandler.findMany({ planId: plan.id })
      await queueForSync('strategyBulk', 'bulk', operation, strategies)

      const indicators = await indicatorHandler.findMany({ planId: plan.id })
      await queueForSync('indicatorBulk', 'bulk', operation, indicators)

      const goalHistory = await goalHistoryHandler.findMany({ planId: plan.id })
      await queueForSync('goalHistoryBulk', 'bulk', operation, goalHistory)

      const strategyHistory = await strategyHistoryHandler.findMany({ planId: plan.id })
      await queueForSync('strategyHistoryBulk', 'bulk', operation, strategyHistory)

      const indicatorHistory = await indicatorHistoryHandler.findMany({ planId: plan.id })
      await queueForSync('indicatorHistoryBulk', 'bulk', operation, indicatorHistory)
    }

    await processSyncQueue()

    await markUserAsSynced(userId)

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

const performFirstTimeSync = async (userId: string): Promise<{ success: boolean, error?: string }> => {
  if (!SyncService.isEnabled) return { success: true }

  try {
    await syncAllData(userId, "create")
    await markUserAsSynced(userId)

    return { success: true }
  } catch (error) {
    console.error('Error during first-time sync:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

const cleanupSyncQueue = async (): Promise<number> => {
  const cutoff = Date.now() - (24 * 60 * 60 * 1000)
  return syncQueueHandler.table
    .where('status')
    .equals('completed')
    .and(item => item.timestamp < cutoff)
    .delete()
}

export const SyncService = {
  isEnabled: ENABLE_CLOUD_SYNC,
  queueForSync,
  getSyncQueueStatus,
  processSyncQueue,
  syncAllData,
  cleanupSyncQueue,
  performFirstTimeSync,
}
