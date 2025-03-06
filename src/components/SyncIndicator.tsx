import { useAccountContext } from '@/app/providers/useAccountContext'
import { Tooltip } from '@/components/ui/tooltip'
import { Flex, Spinner } from '@chakra-ui/react'
import { FiCloud } from 'react-icons/fi'

export function SyncIndicator() {
  const { syncEnabled, syncStatus } = useAccountContext()

  if (!syncEnabled) return null

  if (syncStatus.pending === 0 && syncStatus.processing === 0) return null

  return (
    <Tooltip content={`Syncing: ${syncStatus.pending + syncStatus.processing} items pending`}>
      <Flex align="center" ml={2}>
        {syncStatus.processing > 0 ? (
          <Spinner size="xs" />
        ) : (
          <FiCloud size="14px" />
        )}
      </Flex>
    </Tooltip>
  )
}
