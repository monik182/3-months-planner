import { Editable, Flex, IconButton, Text } from '@chakra-ui/react'
import { WeeksSelector } from '../WeeksSelector'
import { useEffect, useState } from 'react'
import { SlClose } from 'react-icons/sl'
import React from 'react'
import { Strategy } from '@prisma/client'

interface StrategyProps {
  strategy: Strategy
  onChange: (strategy: Strategy) => void
  onAdd: () => void
  onRemove: () => void
  onClick?: () => void
  disabled?: boolean
}

export const StrategyForm = React.memo(function StrategyForm({ strategy, disabled = false, onAdd, onChange, onRemove, onClick }: StrategyProps) {
  const [value, setValue] = useState(strategy)
  const [isEditing, setIsEditing] = useState(false)

  const handleWeekUpdate = (weeks: string[]) => {
    const updatedValue = { ...value, weeks: weeks.sort((a, b) => parseInt(a) - parseInt(b)) }
    setValue(updatedValue)
    onChange(updatedValue)
  }

  const handleValueUpdate = (content: string) => {
    const updatedValue = { ...value, content }
    // console.log('new content>>>>', content)
    setValue(updatedValue)
    onChange(updatedValue)
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

  return (
    <Flex direction="column" onClick={onClick}>
      <Flex justify="space-between" align="center" gap="1rem">
        <Editable.Root
          value={value.content}
          onValueChange={(e) => handleValueUpdate(e.value)}
          placeholder="What is your next strategy?"
          onKeyDown={(e) => handleKeyDown(e)}
          defaultEdit
          disabled={disabled}
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
})
