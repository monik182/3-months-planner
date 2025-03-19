import { useAccountContext } from '@/app/providers/useAccountContext'
import { SyncStatus } from '@/app/types/types'
import { Tooltip } from '@/components/ui/tooltip'
import { Flex, Spinner } from '@chakra-ui/react'
import { FiCloud, FiCloudOff } from 'react-icons/fi'

export function SyncIndicator() {
  const { syncEnabled, syncStatus } = useAccountContext()

  // Don't show anything if sync is not enabled or nothing is happening
  if (!syncEnabled || (syncStatus.pending === 0 && syncStatus.processing === 0 && syncStatus.failed === 0)) {
    return null
  }

  // Show indicator with status
  return (
    <Tooltip content={getTooltipLabel(syncStatus)}>
      <Flex align="center" ml={2} cursor="pointer">
        {syncStatus.processing > 0 ? (
          <Spinner size="sm" />
        ) : syncStatus.failed > 0 ? (
          <FiCloudOff color="red" size="20px" />
        ) : (
          <FiCloud size="20px" />
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

  return parts.join(', ')
}
