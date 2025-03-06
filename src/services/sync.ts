// Create src/services/sync.ts
import { ENABLE_CLOUD_SYNC } from '@/app/constants'
import { SyncQueueItem } from '@/app/types/types'
import { dexieToPlan } from '@/app/util'
import { db } from '@/db/dexie'
import { UserService } from '@/services/user'

// Read the feature flag directly

// TODO: create dexie hadnler for sync table

// Add an item to the sync queue
const queueForSync = async (
  entityType: string,
  entityId: string,
  operation: SyncQueueItem['operation'],
  payload: any
): Promise<number | undefined> => {
  // Only queue if cloud sync is enabled
  if (!SyncService.isEnabled) {
    return undefined
  }

  return db.syncQueue.add({
    entityType,
    entityId,
    operation,
    payload,
    status: 'pending',
    attempts: 0,
    timestamp: Date.now()
  })
}

// Get the sync queue status
const getSyncQueueStatus = async (): Promise<{
  pending: number,
  processing: number,
  failed: number,
  total: number
}> => {
  const pending = await db.syncQueue.where('status').equals('pending').count()
  const processing = await db.syncQueue.where('status').equals('processing').count()
  const failed = await db.syncQueue.where('status').equals('failed').count()
  const total = await db.syncQueue.count()

  return { pending, processing, failed, total }
}

// Process the sync queue
// Enhance processSyncQueue in src/services/sync.ts
const processSyncQueue = async () => {
  if (!SyncService.isEnabled) return { success: true, processed: 0, failed: 0 }

  try {
    // First, reset any items that got stuck in "processing" state
    // (This can happen if the browser closed during processing)
    const stuckItems = await db.syncQueue
      .where('status')
      .equals('processing')
      .toArray()

    if (stuckItems.length > 0) {
      console.log(`Found ${stuckItems.length} items stuck in processing state, resetting...`)
      await Promise.all(stuckItems.map(item =>
        db.syncQueue.update(item.id!, {
          status: 'pending',
          error: 'Item was stuck in processing state and was reset'
        })
      ))
    }

    // Get items to process
    const items = await db.syncQueue
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
        await db.syncQueue.update(item.id!, {
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
        } else if ((item.entityType === 'goal' || item.entityType === 'strategy' || item.entityType === 'indicator') &&
          (item.operation === 'create' || item.operation === 'update')) {
          // Ensure plan exists
          const planId = item.payload.planId
          try {
            const planResponse = await fetch(`/api/plan/${planId}`)
            if (!planResponse.ok) {
              console.log(`Plan ${planId} not yet synced - deferring ${item.entityType} ${item.entityId}`)
              // We'll retry this item later when the plan is synced
              await db.syncQueue.update(item.id!, {
                status: 'pending',
                error: `Waiting for plan ${planId} to be synced first`
              })
              continue // Skip to next item
            }
          } catch (error) {
            // Network error, possibly offline - we'll try again later
            await db.syncQueue.update(item.id!, {
              status: 'pending',
              error: `Network error checking plan: ${error instanceof Error ? error.message : 'Unknown error'}`
            })
            continue // Skip to next item
          }
        }

        if (!canProceed) {
          await db.syncQueue.update(item.id!, {
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
            await db.syncQueue.update(item.id!, {
              status: 'pending',
              error: `Network error: ${error.message}`
            })
            continue // Skip to next item
          }
          throw error // Re-throw other errors to be caught by the outer try/catch
        }

        // Mark item as completed
        await db.syncQueue.update(item.id!, { status: 'completed' })
        processed++

        console.log(`Successfully processed ${item.entityType} ${item.entityId}`)
      } catch (error) {
        console.error(`Error processing ${item.entityType} ${item.entityId}:`, error)

        // Update item status to failed
        await db.syncQueue.update(item.id!, {
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

// Helper function to get API URL for an entity
const getApiUrlForEntity = (entityType: string, entityId: string, operation: string): string | null => {
  switch (entityType) {
    case 'user':
      return operation === 'create' ? '/api/user' : `/api/user/${entityId}`
    case 'plan':
      // Use a custom sync endpoint for plans to handle the Dixie conversion
      return `/api/plan/sync/${entityId}`
    case 'goal':
      return operation === 'create' ? '/api/goal' : `/api/goal/${entityId}`
    case 'strategy':
      return operation === 'create' ? '/api/strategy' : `/api/strategy/${entityId}`
    case 'indicator':
      return operation === 'create' ? '/api/indicator' : `/api/indicator/${entityId}`
    default:
      return null
  }
}

// Helper function to get HTTP method for an operation
const getMethodForOperation = (operation: string): string => {
  switch (operation) {
    // case 'create':
    //   return 'POST'
    // case 'update':
    //   return 'PUT'
    case 'delete':
      return 'DELETE'
    default:
      return 'POST'
  }
}

// Helper function to prepare payload for sync
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

  // Check if record exists
  const existing = await db.userPreferences.get(userId)

  if (existing) {
    await db.userPreferences.update(userId, {
      hasSynced: true,
      lastSyncTime: timestamp
    })
  } else {
    await db.userPreferences.add({
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
    // Try to fetch the user from the server
    const response = await UserService.getRemoteById(userId)

    console.log('********ensureUserExists remote???', response)

    if (response) {
      // User already exists in the database
      return true
    }

    // User doesn't exist in the database, get from local
    const localUser = await UserService.getLocal()
    if (!localUser) {
      console.error(`User with ID ${userId} not found locally`)
      return false
    }
    console.log('>>>>>>>LOCAL USER>>>>', localUser)
    // Create the user in the database
    try {
      const user = await UserService.create(localUser)
      console.log('CRETED USER>>>>>>>>>>>>>', user)
    } catch (error) {
      console.error('Failed to create user in database:', error)
      return false
    }

    console.log(`Created user ${userId} in database`)
    return true
  } catch (error) {
    console.error('Error ensuring user exists:', error)
    return false
  }
}

// Sync all data for a user
const syncAllData = async (userId: string): Promise<{
  success: boolean,
  error?: string
}> => {
  // If cloud sync is disabled, don't sync
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

    // Get plans for this user from Dexie
    const plans = await db.plans.where('userId').equals(userId).toArray()

    // Queue plans for sync
    for (const plan of plans) {
      await queueForSync('plan', plan.id, 'update', plan)

      // Queue goals for this plan
      const goals = await db.goals.where('planId').equals(plan.id).toArray()
      for (const goal of goals) {
        await queueForSync('goal', goal.id, 'update', goal)
      }

      // Queue strategies for this plan
      const strategies = await db.strategies.where('planId').equals(plan.id).toArray()
      for (const strategy of strategies) {
        await queueForSync('strategy', strategy.id, 'update', strategy)
      }

      // Queue indicators for this plan
      const indicators = await db.indicators.where('planId').equals(plan.id).toArray()
      for (const indicator of indicators) {
        await queueForSync('indicator', indicator.id, 'update', indicator)
      }
    }

    // Process the queue
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

// Add to src/services/sync.ts
const performFirstTimeSync = async (userId: string): Promise<{ success: boolean, error?: string }> => {
  if (!SyncService.isEnabled) return { success: true }

  try {
    console.log(`Starting first-time sync for user ${userId}`)

    // 1. First, ensure the user exists in the database
    const userExists = await ensureUserExists(userId)

    if (!userExists) {
      return {
        success: false,
        error: `User with ID ${userId} could not be created in the database`
      }
    }

    console.log(`User ${userId} exists in database`)

    // 2. Sync all plans
    const plans = await db.plans.where('userId').equals(userId).toArray()
    console.log(`Found ${plans.length} plans to sync`)

    for (const plan of plans) {
      // Directly create/update the plan in the database
      const planResponse = await fetch(`/api/plan/sync/${plan.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dexieToPlan(plan)),
      })

      console.log('>>>>PLAND SYNC RESPONSE>>>>', planResponse)

      if (!planResponse.ok) {
        console.log(`Creating??? plan ${plan.id}`)
        // await fetch('/api/plan', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(plan),
        // })
      }

      // // 3. Sync all goals for this plan
      // const goals = await db.goals.where('planId').equals(plan.id).toArray()
      // console.log(`Found ${goals.length} goals for plan ${plan.id}`)

      // for (const goal of goals) {
      //   await fetch(`/api/goal/${goal.id}`, {
      //     method: 'PUT',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(goal),
      //   }).catch(() =>
      //     fetch('/api/goal', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify(goal),
      //     })
      //   )
      // }

      // // 4. Sync all strategies for this plan
      // const strategies = await db.strategies.where('planId').equals(plan.id).toArray()
      // console.log(`Found ${strategies.length} strategies for plan ${plan.id}`)

      // for (const strategy of strategies) {
      //   await fetch(`/api/strategy/${strategy.id}`, {
      //     method: 'PUT',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(strategy),
      //   }).catch(() =>
      //     fetch('/api/strategy', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify(strategy),
      //     })
      //   )
      // }

      // // 5. Sync all indicators for this plan
      // const indicators = await db.indicators.where('planId').equals(plan.id).toArray()
      // console.log(`Found ${indicators.length} indicators for plan ${plan.id}`)

      // for (const indicator of indicators) {
      //   await fetch(`/api/indicator/${indicator.id}`, {
      //     method: 'PUT',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(indicator),
      //   }).catch(() =>
      //     fetch('/api/indicator', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify(indicator),
      //     })
      //   )
      // }
    }

    console.log(`First-time sync completed for user ${userId}`)

    // Mark user as synced
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


// Clean up completed sync items (to prevent the queue from growing too large)
const cleanupSyncQueue = async (): Promise<number> => {
  // Delete completed items older than 24 hours
  const cutoff = Date.now() - (24 * 60 * 60 * 1000)
  return db.syncQueue
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