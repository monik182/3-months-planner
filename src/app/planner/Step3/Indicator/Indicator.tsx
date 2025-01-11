import { Box, Button, Field, Flex, Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { CiFloppyDisk, CiTrash } from 'react-icons/ci'
import { SlStar } from 'react-icons/sl'
import { Alert } from '@/components/ui/alert'
import { Indicator as IndicatorItem } from '@/app/types'

interface IndicatorProps {
  indicator: IndicatorItem
  onChange: (indicator: IndicatorItem) => void
  onRemove: () => void
}

export function Indicator({ indicator, onChange, onRemove }: IndicatorProps) {
  const [value, setValue] = useState(indicator)
  const isNew = indicator.startingValue == null || indicator.goalValue == null || !indicator.content || !indicator.metric
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(isNew)

  const toggleEdit = () => {
    setIsEditing(prev => !prev)
  }

  const handleUpdate = () => {
    setError('')
    if (!value) {
      return
    }
    if (!value.content || value.startingValue == null || value.goalValue == null || !value.metric) {
      setError('Please fill out all fields')
      return
    }
    onChange(value)
    toggleEdit()
  }

  const handleEditValue = (e: React.ChangeEvent<HTMLInputElement>, prop: string) => {
    setError('')
    if (!value) {
      return
    }
    const isNumber = prop === 'startingNumber' || prop === 'goalNumber'

    if (isNumber && isNaN(parseInt(e.target.value))) {
      setValue({ ...value, [prop]: null })
      return
    }

    const parsedValue = isNumber ? parseInt(e.target.value || '0') : e.target.value
    setValue({ ...value, [prop]: parsedValue })
  }

  useEffect(() => {
    if (indicator) {
      setValue(indicator)
    }
  }, [indicator])

  if (!value) {
    return null
  }

  if (!isEditing) {
    return (
      <div>
        <Button variant="outline" colorPalette="yellow" className="mt-5" onClick={toggleEdit}>
          <SlStar /> {value.content}
        </Button>
      </div>
    )
  }

  return (
    <Flex direction="column" w="full" width="500px" gap="1rem" flex="1">
      <Field.Root>
        <Box pos="relative" w="full">
          <Field.Label>What indicator are you tracking?</Field.Label>
          <Input className="peer" placeholder="Specify what you're tracking, like 'Bodyweight,' 'Savings Growth,' or 'Project Completion'." value={value.content} onChange={(e) => handleEditValue(e, 'content')} />
        </Box>
      </Field.Root>
      <Field.Root>
        <Box pos="relative" w="full">
          <Field.Label>What is your starting number?</Field.Label>
          <Input className="peer" placeholder="Enter your current value, for example, 100." value={value.startingValue?.toString() || ''} onChange={(e) => handleEditValue(e, 'startingValue')} />
        </Box>
      </Field.Root>
      <Field.Root>
        <Box pos="relative" w="full">
          <Field.Label>What is your goal number?</Field.Label>
          <Input className="peer" placeholder="Enter your goal value, for example, 200." value={value.goalValue?.toString() || ''} onChange={(e) => handleEditValue(e, 'goalValue')} />
        </Box>
      </Field.Root>
      <Field.Root>
        <Box pos="relative" w="full">
          <Field.Label>What is the unit of measurement?</Field.Label>
          <Input className="peer" placeholder="Indicate the unit, such as kilograms, euros, number of calls, or transactions." value={value.metric} onChange={(e) => handleEditValue(e, 'metric')} />
        </Box>
      </Field.Root>
      {error && <Alert status="error" title={error} />}
      <Flex justify="flex-end" gap="5px">
        <Button size="xs" variant="outline" onClick={onRemove}>
          <CiTrash />
          Remove
        </Button>
        <Button size="xs" variant="outline" onClick={handleUpdate}>
          <CiFloppyDisk />
          Save
        </Button>
      </Flex>
    </Flex>
  )
}
