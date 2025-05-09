import { ENABLE_CLOUD_SYNC } from '@/app/constants'
import { isItemQueuedForOperation } from '@/services/sync/itemQueuedForOperation'
import { processSyncQueue } from '@/services/sync/processSyncQueue'
import { filterQueuedForDeletion, queueForSync } from '@/services/sync/shared'


export const SyncService = {
  isEnabled: ENABLE_CLOUD_SYNC,
  queueForSync,
  processSyncQueue,
  isItemQueuedForOperation,
  filterQueuedForDeletion,
}
