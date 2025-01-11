import { Editable, Flex, IconButton, Text } from '@chakra-ui/react'
import { WeeksSelector } from './WeeksSelector'
import { useEffect, useState } from 'react'
import { SlClose } from 'react-icons/sl'
import { Strategy as StrategyItem } from '@/types'

interface StrategyProps {
  strategy: StrategyItem
  onChange: (strategy: StrategyItem) => void
  onAdd: () => void
  onRemove: () => void
}

export function Strategy({ strategy, onAdd, onChange, onRemove }: StrategyProps) {
  const [value, setValue] = useState(strategy)
  const [isEditing, setIsEditing] = useState(false)

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
    setIsEditing(prev => !prev)
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
          value={value.content}
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
        >
          <SlClose size="xs" />
        </IconButton>
      </Flex>
      {isEditing ? (
        <WeeksSelector weeks={value.weeks} setWeeks={handleWeekUpdate} onFocusOutside={() => toggleWeeksSelector()} />
      ) : (
        <Text textStyle="sx" onClick={toggleWeeksSelector}>Due: {value.weeks.length === 12 ? 'Every week' : `Weeks ${value.weeks.join(', ')}`}</Text>
      )}
    </Flex>
  )
}
