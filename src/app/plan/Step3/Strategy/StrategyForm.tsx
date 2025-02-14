import { Box, Editable, Flex, Grid, IconButton, Text } from '@chakra-ui/react'
import { WeeksSelector } from '../WeeksSelector'
import { useEffect, useState } from 'react'
import { SlClose } from 'react-icons/sl'
import React from 'react'
import { Strategy } from '@prisma/client'
import { FrequencySelector } from '@/app/plan/Step3/FrequencySelector'
import { DEFAULT_FREQUENCY_LIST } from '@/app/constants'

interface StrategyProps {
  strategy: Omit<Strategy, 'status'>
  onChange: (strategy: Omit<Strategy, 'status'>) => void
  onAdd?: () => void
  onRemove: () => void
  onClick?: () => void
  disabled?: boolean
}

export const StrategyForm = React.memo(function StrategyForm({ strategy, disabled = false, onAdd, onChange, onRemove, onClick }: StrategyProps) {
  const [value, setValue] = useState(strategy)
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingFrequency, setIsEditingFrequency] = useState(false)

  const handleWeekUpdate = (weeks: string[]) => {
    const updatedValue = { ...value, weeks: weeks.sort((a, b) => parseInt(a) - parseInt(b)) }
    setValue(updatedValue)
    onChange(updatedValue)
  }

  const handleFrequencyUpdate = (frequency: number) => {
    const updatedValue = { ...value, frequency }
    setValue(updatedValue)
    onChange(updatedValue)
  }

  const handleValueUpdate = (content: string) => {
    const updatedValue = { ...value, content }
    setValue(updatedValue)
    onChange(updatedValue)
  }

  const toggleWeeksSelector = () => {
    setIsEditing(prev => !prev)
  }

  const toggleFrequencySelector = () => {
    setIsEditingFrequency(prev => !prev)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onAdd?.()
    }
  }

  useEffect(() => {
    setValue(strategy)
  }, [strategy])

  return (
    <Grid templateColumns="45% 1fr 1fr 2.5rem" alignItems="center" gap="1rem" onClick={onClick}>
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
          <Editable.Input disabled={disabled} autoComplete="off" />
        </Editable.Root>
      </Flex>
      {isEditing ? (
        <WeeksSelector weeks={value.weeks} setWeeks={handleWeekUpdate} onFocusOutside={toggleWeeksSelector} />
      ) : (
        <Text textStyle="sm" onClick={toggleWeeksSelector}>Due: {value.weeks.length === 12 ? 'Every week' : `Weeks ${value.weeks.join(', ')}`}</Text>
      )}
      <Box>
        {isEditingFrequency ?
          (
            <FrequencySelector frequency={value.frequency} setFrequency={handleFrequencyUpdate} onFocusOutside={toggleFrequencySelector} />
          ) : (
            <Text textStyle="sm" onClick={toggleFrequencySelector}>{DEFAULT_FREQUENCY_LIST[value.frequency - 1].label}</Text>
        )}
      </Box>
      <IconButton
        size="xs"
        variant="ghost"
        aria-label="Remove list item"
        onClick={onRemove}
      >
        <SlClose size="xs" />
      </IconButton>
    </Grid>
  )
})
