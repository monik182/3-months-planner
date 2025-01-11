import { Flex, Text } from '@chakra-ui/react'
import { Strategy as IStrategy } from '@/app/types'
import { Checkbox } from '@/components/ui/checkbox'
import { usePlanContext } from '../../providers/usePlanContext'
import { PiTimerThin } from 'react-icons/pi'

interface StrategyProps {
  strategy: IStrategy
}

export function Strategy({ strategy }: StrategyProps) {
  const { updateStrategyChecked } = usePlanContext()
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
