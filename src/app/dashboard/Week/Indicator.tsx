import { Box } from '@chakra-ui/react'
import { IndicatorTracking } from '@/types'
import { StatDownTrend, StatLabel, StatRoot, StatValueText } from '@/components/ui/stat'
import { useState } from 'react'
import { usePlanTracking } from '../../providers/usePlanTracking'
import { NumberInputField, NumberInputRoot } from '@/components/ui/number-input'

interface IndicatorProps {
  indicator: IndicatorTracking
}
export function Indicator({ indicator }: IndicatorProps) {
  const { updateIndicatorValue } = usePlanTracking()

  const [showInput, setShowInput] = useState(false)
  const toggleShowInput = () => {
    setShowInput(prev => !prev)
  }
  const shouldGoUp = (indicator.startingNumber || 0) < (indicator.goalNumber || 0)
  const isUpTrend = indicator.value > (indicator.goalNumber || 0)

  return (
    <Box>
      <StatRoot>
        <StatLabel info={`Target: ${indicator.goalNumber}`}>{indicator.content}</StatLabel>
        {!showInput ? (
          <StatValueText cursor="pointer" onClick={toggleShowInput}>{indicator.value.toString()}</StatValueText>
        ) : (
          <StatValueText>
              <NumberInputRoot size="xs" value={indicator.value.toString()} step={1} onValueChange={(e) => updateIndicatorValue(indicator.weekId, indicator.id, parseInt(e.value))}>
                <NumberInputField placeholder={`Enter ${indicator.content}`} onMouseOut={toggleShowInput} />
              </NumberInputRoot>
          </StatValueText>
        )}
        <StatDownTrend variant="plain" px="0">
          1.9%
        </StatDownTrend>
      </StatRoot>
    </Box>
  )
}
