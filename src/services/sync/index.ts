import { ENABLE_CLOUD_SYNC } from '@/app/constants'
import { QueueOperation, QueueStatus, } from '@/app/types/types'
import { syncQueueHandler } from '@/db/dexieHandler'
import { cleanupOrphanedRecords } from '@/services/cleanup'
import { isItemQueuedForOperation } from '@/services/sync/itemQueuedForOperation'
import { processSyncQueue } from '@/services/sync/processSyncQueue'
import { filterQueuedForDeletion, markUserAsSynced, queueForSync } from '@/services/sync/shared'
import { syncAllData } from '@/services/sync/syncAllData'

const getSyncQueueStatus = async (): Promise<{
  pending: number,
  processing: number,
  failed: number,
  total: number,
}> => {
  const pending = await syncQueueHandler.countByStatus(QueueStatus.PENDING)
  const processing = await syncQueueHandler.countByStatus(QueueStatus.PROCESSING)
  const failed = await syncQueueHandler.countByStatus(QueueStatus.FAILED)
  const total = await syncQueueHandler.table.count()

  return { pending, processing, failed, total }
}

const performFirstTimeSync = async (userId: string): Promise<{ success: boolean, error?: string }> => {
  if (!SyncService.isEnabled) return { success: true }

  try {
    // Clean up any orphaned records first
    await cleanupOrphanedRecords()

    await syncAllData(userId, QueueOperation.CREATE)
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
    .equals(QueueStatus.COMPLETED)
    .and(item => item.timestamp < cutoff)
    .delete()
}

const cleanupCompletedItems = async (olderThan: number = 24 * 60 * 60 * 1000): Promise<number> => {
  const cutoff = Date.now() - olderThan;

  return syncQueueHandler.table
    .where('status')
    .equals(QueueStatus.COMPLETED)
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
  isItemQueuedForOperation,
  filterQueuedForDeletion,
  cleanupCompletedItems,
}
