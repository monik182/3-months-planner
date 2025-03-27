import { useAccountContext } from '@/app/providers/useAccountContext'
import { SyncStatus } from '@/app/types/types'
import { Tooltip } from '@/components/ui/tooltip'
import { Flex, Spinner } from '@chakra-ui/react'
import { FiCloud, FiCloudOff } from 'react-icons/fi'
import { useState } from 'react'
import { toaster } from '@/components/ui/toaster'
import { SyncService } from '@/services/sync'

export function SyncIndicator() {
  const { syncEnabled, syncStatus, triggerSync } = useAccountContext()
  const [isSyncing, setIsSyncing] = useState(false)

  // Don't show anything if sync is not enabled or nothing is happening
  if (!syncEnabled || (syncStatus.pending === 0 && syncStatus.processing === 0 && syncStatus.failed === 0 && !isSyncing)) {
    return null
  }

  const handleSync = async () => {
    if (isSyncing) return

    setIsSyncing(true)
    toaster.create({
      title: 'Sync initiated',
      description: 'Your data is being synchronized',
      type: 'info',
      duration: 2000,
    })
    try {
      if (syncStatus.failed > 0) {
        await SyncService.cleanupOrphanedRecords()
        await SyncService.resetFailedItems()
        // await triggerSync()
      } else {
        await triggerSync()
      }

    } catch (error) {
      toaster.create({
        title: 'Sync failed',
        description: error instanceof Error ? error.message : 'Failed to start sync',
        type: 'error',
        duration: 2000,
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // Show indicator with status
  return (
    <Tooltip content={getTooltipLabel(syncStatus)}>
      <Flex align="center" ml={2} cursor={isSyncing ? 'default' : 'pointer'}>
        {isSyncing || syncStatus.processing > 0 ? (
          <Spinner size="sm" />
        ) : syncStatus.failed > 0 ? (
          <FiCloudOff
            color="red"
            size="20px"
            onClick={handleSync}
            style={{ opacity: isSyncing ? 0.5 : 1 }} 
          />
        ) : (
          <FiCloud
            size="20px"
            onClick={handleSync}
            style={{ opacity: isSyncing ? 0.5 : 1 }}
          />
        )}
      </Flex>
    </Tooltip>
  )
}

function getTooltipLabel(status: SyncStatus): string {
  const parts = []

  if (status.processing > 0) {
    parts.push(`Syncing: ${status.processing} items`)
  }

  if (status.pending > 0) {
    parts.push(`Pending: ${status.pending} items`)
  }

  if (status.failed > 0) {
    parts.push(`Failed: ${status.failed} items`)
  }

  return parts.join(', ') || 'Click to sync'
}
