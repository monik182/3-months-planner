import { Box, Button, Field, Flex, Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { CiFloppyDisk, CiTrash } from 'react-icons/ci'
import { SlStar } from 'react-icons/sl'
import { Alert } from '@/components/ui/alert'

export interface IndicatorItem {
  value: string
  startingNumber: number | null
  goalNumber: number | null
  metric: string
  isEditing: boolean
}

interface IndicatorProps {
  indicator?: IndicatorItem
  updateMeasurement: (indicator: IndicatorItem) => void
  removeMeasurement: () => void
}
export const DEFAULT_MEASUREMENT = { value: '', startingNumber: null, goalNumber: null, metric: '', isEditing: false }
export function Indicator({ indicator, updateMeasurement, removeMeasurement }: IndicatorProps) {
  const [value, setValue] = useState(indicator)
  const [error, setError] = useState('')
  const handleUpdate = () => {
    setError('')
    if (!value) {
      return
    }
    if (!value.value || !value.startingNumber || !value.goalNumber || !value.metric) {
      setError('Please fill out all fields')
      return
    }
    updateMeasurement({ ...value, isEditing: false })
  }

  const handleEnableEditing = () => {
    if (!value) {
      return
    }
    updateMeasurement({ ...value, isEditing: true })
  }

  const handleEditValue = (e: React.ChangeEvent<HTMLInputElement>, prop: string) => {
    setError('')
    if (!value) {
      return
    }
    const isNumber = prop === 'startingNumber' || prop === 'goalNumber'
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

  if (!value.isEditing) {
    return (
      <div>
        <Button variant="outline" colorPalette="yellow" className="mt-5" onClick={handleEnableEditing}>
          <SlStar /> {value.value}
        </Button>
      </div>
    )
  }

  return (
    <Flex direction="column" w="full" width="500px" gap="1rem" flex="1">
      <Field.Root>
        <Box pos="relative" w="full">
          <Field.Label>What indicator are you tracking?</Field.Label>
          <Input className="peer" placeholder="Specify what you're tracking, like 'Bodyweight,' 'Savings Growth,' or 'Project Completion'." value={value.value} onChange={(e) => handleEditValue(e, 'value')} />
        </Box>
      </Field.Root>
      <Field.Root>
        <Box pos="relative" w="full">
          <Field.Label>What is your starting number?</Field.Label>
          <Input className="peer" placeholder="Enter your current value, for example, 100." value={value.startingNumber?.toString()} onChange={(e) => handleEditValue(e, 'startingNumber')} />
        </Box>
      </Field.Root>
      <Field.Root>
        <Box pos="relative" w="full">
          <Field.Label>What is your goal number?</Field.Label>
          <Input className="peer" placeholder="Enter your goal value, for example, 200." value={value.goalNumber?.toString()} onChange={(e) => handleEditValue(e, 'goalNumber')} />
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
        <Button size="xs" variant="outline" onClick={removeMeasurement}>
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
