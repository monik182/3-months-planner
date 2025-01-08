import { Box, HStack } from '@chakra-ui/react'
import { Indicator as IIndicator } from '@/types'
import { StatDownTrend, StatLabel, StatRoot, StatUpTrend, StatValueText } from '@/components/ui/stat'
import { useState } from 'react'
import { usePlanTracking } from '../../providers/usePlanTracking'
import { NumberInputField, NumberInputRoot } from '@/components/ui/number-input'
import { calculateIndicatorTrend } from '../../util'

interface IndicatorProps {
  indicator: IIndicator
}
export function Indicator({ indicator }: IndicatorProps) {
  const { updateIndicatorValue, plan } = usePlanTracking()
  const currentWeek = plan.weeks.find((week) => week.id === indicator.weekId)
  const weekIndex = plan.weeks.findIndex((week) => week.id === indicator.weekId)
  const previousWeek = weekIndex > 0 ? plan.weeks[weekIndex - 1] : undefined
  const trend = calculateIndicatorTrend(indicator.id, currentWeek!, previousWeek)

  const [showInput, setShowInput] = useState(false)
  const toggleShowInput = () => {
    setShowInput(prev => !prev)
  }
  const isUpTrend = trend >= 0

  return (
    <Box>
      <StatRoot>
        <StatLabel info={`Target: ${indicator.goalNumber}`}>{indicator.content}</StatLabel>
        <HStack>
        {!showInput ? (
            <StatValueText cursor="pointer" onClick={toggleShowInput}>{indicator.value.toString()}</StatValueText>
        ) : (
          <StatValueText>
              <NumberInputRoot size="xs" value={indicator.value.toString()} step={1} onValueChange={(e) => updateIndicatorValue(indicator.weekId, indicator.id, parseInt(e.value))} min={0}>
                <NumberInputField placeholder={`Enter ${indicator.content}`} onMouseOut={toggleShowInput} />
              </NumberInputRoot>
          </StatValueText>
        )}
          <div>
            {isUpTrend ? (
              <StatUpTrend>{trend}%</StatUpTrend>
            ) : (
              <StatDownTrend>{trend}%</StatDownTrend>
            )}
          </div>
        </HStack>
      </StatRoot>
    </Box>
  )
}
