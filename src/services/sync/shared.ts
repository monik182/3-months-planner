import { QueueEntityType, QueueOperation, QueueStatus, SyncQueueItem } from '@/app/types/types'
import { syncQueueHandler, userPreferencesHandler } from '@/db/dexieHandler'
import { SyncService } from '@/services/sync'
import { UserService } from '@/services/user'

export const validateUserExists = async (userId: string): Promise<boolean> => {
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

export const markUserAsSynced = async (userId: string) => {
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

export const queueForSync = async (
  entityType: QueueEntityType,
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
    status: QueueStatus.PENDING,
    attempts: 0,
    timestamp: Date.now()
  })
}

export const filterQueuedForDeletion = async (items: any[], entityType: QueueEntityType): Promise<any[]> => {
  const result: any[] = []

  for (const item of items) {
    const isQueuedForDeletion = await SyncService.isItemQueuedForOperation(
      entityType,
      item.id,
      QueueOperation.DELETE,
    )

    if (!isQueuedForDeletion) {
      result.push(item)
    }
  }

  return result
}
