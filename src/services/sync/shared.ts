import { QueueEntityType, QueueOperation, QueueStatus, SyncQueueItem } from '@/app/types/types'
import { dexieToPlan } from '@/app/util'
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

    // If remote check fails, try to create from local
    const localUser = await UserService.getLocal()
    if (!localUser) {
      throw new Error(`User with ID ${userId} not found locally`)
    }

    // Add retry logic for user creation
    let retries = 3
    while (retries > 0) {
      try {
        await UserService.create(localUser)
        return true
      } catch (error) {
        retries--
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    return false
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

export const getBulkEntityType = (entityType: QueueEntityType): QueueEntityType | null => {
  switch (entityType) {
    case QueueEntityType.GOAL:
      return QueueEntityType.GOAL_BULK
    case QueueEntityType.STRATEGY:
      return QueueEntityType.STRATEGY_BULK
    case QueueEntityType.INDICATOR:
      return QueueEntityType.INDICATOR_BULK
    case QueueEntityType.GOAL_HISTORY:
      return QueueEntityType.GOAL_HISTORY_BULK
    case QueueEntityType.STRATEGY_HISTORY:
      return QueueEntityType.STRATEGY_HISTORY_BULK
    case QueueEntityType.INDICATOR_HISTORY:
      return QueueEntityType.INDICATOR_HISTORY_BULK
    default:
      return null
  }
}

export const getApiUrlForEntity = (entityType: QueueEntityType, entityId: string, operation: QueueOperation): string | null => {
  switch (entityType) {
    case QueueEntityType.USER:
      return operation === QueueOperation.CREATE ? '/api/user' : `/api/user/${entityId}`
    case QueueEntityType.PLAN:
      return operation === QueueOperation.CREATE ? '/api/plan/' : `/api/plan/${entityId}`
    case QueueEntityType.GOAL:
      return operation === QueueOperation.CREATE ? '/api/goal' : `/api/goal/${entityId}`
    case QueueEntityType.GOAL_BULK:
      return operation === QueueOperation.CREATE || QueueOperation.DELETE ? '/api/goal/bulk' : null
    case QueueEntityType.GOAL_HISTORY:
      return operation === QueueOperation.CREATE ? '/api/goal/history' : `/api/goal/history/${entityId}`
    case QueueEntityType.GOAL_HISTORY_BULK:
      return operation === QueueOperation.CREATE || QueueOperation.DELETE ? '/api/goal/history/bulk' : null
    case QueueEntityType.STRATEGY:
      return operation === QueueOperation.CREATE ? '/api/strategy' : `/api/strategy/${entityId}`
    case QueueEntityType.STRATEGY_BULK:
      return operation === QueueOperation.CREATE || QueueOperation.DELETE ? '/api/strategy/bulk' : null
    case QueueEntityType.STRATEGY_HISTORY:
      return operation === QueueOperation.CREATE ? '/api/strategy/history' : `/api/strategy/history/${entityId}`
    case QueueEntityType.STRATEGY_HISTORY_BULK:
      return operation === QueueOperation.CREATE || QueueOperation.DELETE ? '/api/strategy/history/bulk' : null
    case QueueEntityType.INDICATOR:
      return operation === QueueOperation.CREATE ? '/api/indicator' : `/api/indicator/${entityId}`
    case QueueEntityType.INDICATOR_BULK:
      return operation === QueueOperation.CREATE || QueueOperation.DELETE ? '/api/indicator/bulk' : null
    case QueueEntityType.INDICATOR_HISTORY:
      return operation === QueueOperation.CREATE ? '/api/indicator/history' : `/api/indicator/history/${entityId}`
    case QueueEntityType.INDICATOR_HISTORY_BULK:
      return operation === QueueOperation.CREATE || QueueOperation.DELETE ? '/api/indicator/history/bulk' : null
    default:
      return null
  }
}

export const getMethodForOperation = (operation: string): string => {
  switch (operation) {
    case QueueOperation.DELETE:
      return QueueOperation.DELETE.toUpperCase()
    case QueueOperation.UPDATE:
      return QueueOperation.UPDATE.toUpperCase()
    default:
      return QueueOperation.CREATE.toUpperCase()
  }
}

export const preparePayloadForSync = (entityType: QueueEntityType, payload: any): any => {
  switch (entityType) {
    case QueueEntityType.PLAN:
      return dexieToPlan(payload)
    default:
      return payload
  }
}
