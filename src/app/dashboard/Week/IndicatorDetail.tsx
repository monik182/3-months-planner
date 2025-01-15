import { UseUpdate } from '@/app/hooks/useIndicatorHistoryActions'
import { IndicatorHistoryExtended } from '@/app/types/types'
import { NumberInputField } from '@/components/ui/number-input'
import { Tag } from '@/components/ui/tag'
import { Flex, NumberInputRoot, Text } from '@chakra-ui/react'
import { ValueChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/number-input/namespace'
import { useState } from 'react'
import { LuActivity } from 'react-icons/lu'

interface IndicatorDetailProps {
  indicator: IndicatorHistoryExtended
  onChange: UseUpdate['mutate']
}
export function IndicatorDetail({ indicator, onChange }: IndicatorDetailProps) {
  const [edit, setEdit] = useState(false)
  const { content, metric, startingValue, goalValue } = indicator.indicator
  const [value, setValue] = useState(indicator.value)

  const handleOnValueChange = ({ valueAsNumber }: ValueChangeDetails) => {
    if (!isNaN(valueAsNumber)) {
      setValue(valueAsNumber)
    }
  }

  const handleOnMouseOut = () => {
    setEdit(false)
    if (isNaN(value) || value === indicator.value) {
      setValue(indicator.value)
      return
    }
    onChange({ indicatorId: indicator.id, updates: { value } })
  }
  const isGoalBigger = goalValue > startingValue
  const tagText = isGoalBigger ? `${value} out of ${goalValue}` : `Down from ${startingValue} to ${value}`
  const tagColor = value >= goalValue ? 'green' : 'yellow'

  return (
    <div onMouseOut={handleOnMouseOut}>
      {edit && (
        <Flex gap="1rem" alignItems="flex-end">
          <NumberInputRoot
            size="xs"
            step={1}
            min={0}
            value={value.toString()}
            width={100}
            onValueChange={handleOnValueChange}
          >
            <NumberInputField />
          </NumberInputRoot>
          <Text fontSize="sm">{metric}</Text>
        </Flex>
      )}
      {!edit && (
        <Tag
          startElement={<LuActivity />}
          colorPalette={tagColor}
          variant="outline"
          onClick={() => setEdit(true)}
          onMouseOut={() => setEdit(false)}
          cursor="pointer"
        >
          {content}: {tagText}
        </Tag>
      )}
    </div>
  )
}
