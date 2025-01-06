import { Box, Input } from '@chakra-ui/react'
import { IndicatorTracking } from '@/types'
import { StatDownTrend, StatLabel, StatRoot, StatValueText } from '@/components/ui/stat'
import { useState } from 'react'

interface IndicatorProps {
  indicator: IndicatorTracking
}
export function Indicator({ indicator }: IndicatorProps) {
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
              <Input placeholder={`Enter ${indicator.content}`} value={indicator.value.toString()} onMouseOut={toggleShowInput} />
          </StatValueText>
        )}
        <StatDownTrend variant="plain" px="0">
          1.9%
        </StatDownTrend>
      </StatRoot>
    </Box>
  )
}
