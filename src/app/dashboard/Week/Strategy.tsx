import { Box } from '@chakra-ui/react'
import { StrategyTracking } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'

interface StrategyProps {
  strategy: StrategyTracking
}

export function Strategy({ strategy }: StrategyProps) {
  return (
    <Box>
      <Checkbox
        checked={strategy.checked}
        // onCheckedChange={(e) => setChecked(!!e.checked)}
      >
        {strategy.content}
      </Checkbox>
    </Box>
  )
}
