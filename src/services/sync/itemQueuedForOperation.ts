import { syncQueueHandler } from '@/db/dexieHandler'
import { QueueEntityType, QueueOperation } from '@/app/types/types'

export const isItemQueuedForOperation = async (
  entityType: QueueEntityType,
  id: string,
  operation: QueueOperation
): Promise<boolean> => {
  try {
    const matchingItems = await syncQueueHandler.table
      .where('entityType').equals(entityType)
      .and(item => item.entityId === id && item.operation === operation)
      .toArray()

    return matchingItems.length > 0;
  } catch (error) {
    console.error('Error checking sync queue:', error)
    return false
  }
}
