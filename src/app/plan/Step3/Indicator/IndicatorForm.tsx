import { Box, Button, Field, Flex, Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { CiFloppyDisk, CiTrash } from 'react-icons/ci'
import { Alert } from '@/components/ui/alert'
import { Indicator } from '@prisma/client'
import { NumberInputField, NumberInputRoot } from '@/components/ui/number-input'
import { ValueChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/number-input/namespace'
import { Field as UiField } from '@/components/ui/field'

interface IndicatorFormProps {
  indicator: Omit<Indicator, 'status'>
  onChange: (indicator: Omit<Indicator, 'status'>) => void
  onRemove: () => void
}

export function IndicatorForm({ indicator, onChange, onRemove }: IndicatorFormProps) {
  const [value, setValue] = useState(indicator)
  const [error, setError] = useState('')

  const handleUpdate = () => {
    setError('')
    if (!value) {
      return
    }
    if (!value.content || value.initialValue == null || value.goalValue == null || !value.metric) {
      setError('Please fill out all fields')
      return
    }
    onChange(value)
  }

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>, prop: string) => {
    setError('')
    if (!value) {
      return
    }
    const isNumber = prop === 'initialValue' || prop === 'goalValue'

    if (isNumber && isNaN(parseInt(e.target.value))) {
      setValue({ ...value, [prop]: null })
      return
    }

    const parsedValue = isNumber ? parseInt(e.target.value || '0') : e.target.value
    setValue({ ...value, [prop]: parsedValue })
  }

  const handleValueChange = ({ valueAsNumber }: ValueChangeDetails, prop: string) => {
    if (!isNaN(valueAsNumber)) {
      setValue({ ...value, [prop]: valueAsNumber })
    }
  }

  useEffect(() => {
    if (indicator) {
      setValue(indicator)
    }
  }, [indicator])

  return (
    <Flex direction="column" w="full" width="500px" gap="1rem" flex="1">
      <Field.Root>
        <Box pos="relative" w="full">
          <Field.Label>What indicator are you tracking?</Field.Label>
          <Input placeholder="Specify what you're tracking, like 'Bodyweight,' 'Savings Growth,' or 'Project Completion'." value={value.content} onChange={(e) => handleEdit(e, 'content')} />
        </Box>
      </Field.Root>
      <Field.Root>
        <Box pos="relative" w="full">
          <UiField label="" helperText="Enter your current value, for example, 100.">
            <NumberInputRoot
              step={1}
              min={0}
              value={value.initialValue?.toString() || ''}
              onValueChange={(e) => handleValueChange(e, 'initialValue')}
            >
              <NumberInputField />
            </NumberInputRoot>
          </UiField>
        </Box>
      </Field.Root>
      <Field.Root>
        <Box pos="relative" w="full">
          <UiField label="What is your starting number?<" helperText="Enter your goal value, for example, 200.">
            <NumberInputRoot
              step={1}
              min={0}
              value={value.goalValue?.toString() || ''}
              onValueChange={(e) => handleValueChange(e, 'goalValue')}
            >
              <NumberInputField />
            </NumberInputRoot>
          </UiField>
        </Box>
      </Field.Root>
      <Field.Root>
        <Box pos="relative" w="full">
          <Field.Label>What is the unit of measurement?</Field.Label>
          <Input placeholder="Indicate the unit, such as kilograms, euros, number of calls, or transactions." value={value.metric} onChange={(e) => handleEdit(e, 'metric')} />
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
