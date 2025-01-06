import { Box } from '@chakra-ui/react'
import { StrategyTracking } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { usePlanTracking } from '../../providers/usePlanTracking'

interface StrategyProps {
  strategy: StrategyTracking
}

export function Strategy({ strategy }: StrategyProps) {
  const { updateStrategyChecked } = usePlanTracking()

  return (
    <Box>
      <Checkbox
        checked={strategy.checked}
        onCheckedChange={(e) => updateStrategyChecked(strategy.weekId, strategy.id, !!e.checked)}
      >
        {strategy.content}
      </Checkbox>
    </Box>
  )
}
