import { Editable, Flex, IconButton, Text } from '@chakra-ui/react'
import { DEFAULT_WEEKS, WeeksSelector } from './WeeksSelector'
import { useEffect, useState } from 'react'
import { SlClose } from 'react-icons/sl'


export interface StrategyItem {
  id: string
  value: string
  weeks: string[]
  isEditing: boolean
}

interface StrategyProps {
  strategy?: StrategyItem
  onChange: (strategy: StrategyItem) => void
  onAdd: () => void
  onRemove?: () => void
}

export const DEFAULT_STRATEGY = { id: '', value: '', weeks: [...DEFAULT_WEEKS], isEditing: false }

export function Strategy({ strategy = DEFAULT_STRATEGY, onAdd, onChange, onRemove }: StrategyProps) {
  const [value, setValue] = useState(strategy)

  const handleWeekUpdate = (weeks: string[]) => {
    setValue(value => {
      const updatedValue = { ...value, weeks: weeks.sort((a, b) => parseInt(a) - parseInt(b)) }
      onChange(updatedValue)
      return updatedValue
    })
  }

  const handleValueUpdate = (newValue: string) => {
    setValue(value => {
      const updatedValue = { ...value, value: newValue }
      onChange(updatedValue)
      return updatedValue
    })
  }

  const toggleWeeksSelector = () => {
    setValue(value => {
      const updatedValue = { ...value, isEditing: !value.isEditing }
      onChange(updatedValue)
      return updatedValue
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onAdd()
    }
  }

  useEffect(() => {
    setValue(strategy)
  }, [strategy])

  if (!value) {
    return null
  }

  return (
    <Flex direction="column">
      <Flex justify="space-between" align="center" gap="1rem">
        <Editable.Root
          value={value.value}
          onValueChange={(e) => handleValueUpdate(e.value)}
          placeholder="What is your next strategy?"
          onKeyDown={(e) => handleKeyDown(e)}
          defaultEdit
        >
          <Editable.Preview />
          <Editable.Input />
        </Editable.Root>
        <IconButton
          size="xs"
          variant="ghost"
          aria-label="Remove list item"
          onClick={onRemove}
          disabled={!onRemove}
        >
          <SlClose size="xs" />
        </IconButton>
      </Flex>
      {value.isEditing ? (
        <WeeksSelector weeks={value.weeks} setWeeks={handleWeekUpdate} onFocusOutside={() => toggleWeeksSelector()} />
      ) : (
        <Text textStyle="sx" onClick={toggleWeeksSelector}>Due: {value.weeks.length === 12 ? 'Every week' : `Weeks ${value.weeks.join(', ')}`}</Text>
      )}
    </Flex>
  )
}
