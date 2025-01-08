import { Flex, Text } from '@chakra-ui/react'
import { Strategy as IStrategy } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { usePlanTracking } from '../../providers/usePlanTracking'
import { PiTimerThin } from 'react-icons/pi'

interface StrategyProps {
  strategy: IStrategy
}

export function Strategy({ strategy }: StrategyProps) {
  const { updateStrategyChecked } = usePlanTracking()
  const showOverdue = strategy.overdue && !strategy.checked

  return (
    <Flex align="flex-start" justifyContent="space-between">
      <Checkbox
        alignItems="flex-start"
        checked={strategy.checked}
        onCheckedChange={(e) => updateStrategyChecked(strategy.weekId, strategy.id, !!e.checked)}
      >
        {strategy.content}
        <Text textStyle="sx">Due: {strategy.weeks.length === 12 ? 'Every week' : `Weeks ${strategy.weeks.join(', ')}`}</Text>
      </Checkbox>
      {showOverdue && (
        <PiTimerThin fontSize="2rem" color="red" />
      )}
    </Flex>
  )
}
