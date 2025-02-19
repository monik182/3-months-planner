import { Flex, Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { CiFloppyDisk, CiTrash } from 'react-icons/ci'
import { Alert } from '@/components/ui/alert'
import { Indicator } from '@prisma/client'
import { NumberInputField, NumberInputRoot } from '@/components/ui/number-input'
import { ValueChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/number-input/namespace'
import { Field } from '@/components/ui/field'
import { Button } from '@/components/ui/button'

interface IndicatorFormProps {
  indicator: Omit<Indicator, 'status'>
  onChange: (indicator: Omit<Indicator, 'status'>) => void
  onRemove: () => void
  loading: boolean
}

export function IndicatorForm({ indicator, loading, onChange, onRemove }: IndicatorFormProps) {
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
    <Flex w="full" gap="1rem" flex="1" margin="1rem 0" padding="1rem">
      <Flex gap="1rem" alignItems="flex-start">
        <Field label="What indicator are you tracking?" helperText="Specify what you're tracking, like 'Bodyweight,' 'Savings Growth,' or 'Project Completion'.">
          <Input size="xs" placeholder="Eg. Bodyweight, Savings Growth, Project Completion" value={value.content} onChange={(e) => handleEdit(e, 'content')} autoComplete="off" />
        </Field>

        <Field label="What is your current value?" helperText="Enter your current value, for example, 100.">
          <NumberInputRoot
            size="xs"
            step={1}
            min={0}
            value={value.initialValue?.toString() || ''}
            onValueChange={(e) => handleValueChange(e, 'initialValue')}
          >
            <NumberInputField />
          </NumberInputRoot>
        </Field>

        <Field label="What is your goal value?" helperText="Enter your goal value, for example, 200.">
          <NumberInputRoot
            size="xs"
            step={1}
            min={0}
            value={value.goalValue?.toString() || ''}
            onValueChange={(e) => handleValueChange(e, 'goalValue')}
          >
            <NumberInputField />
          </NumberInputRoot>
        </Field>
        <Field label="What is the unit of measurement?" helperText="Indicate the unit, such as kilograms, euros, number of calls, or transactions.">
          <Input size="xs" placeholder="Eg. kilograms, euros, number of calls, or transactions." value={value.metric} onChange={(e) => handleEdit(e, 'metric')} autoComplete="off" />
        </Field>
      </Flex>
      {error && <Alert status="error" title={error} />}
      <Flex direction="column" justify="center" gap="5px">
        <Button size="xs" variant="ghost" onClick={handleUpdate} colorPalette="green" title="Save" loading={loading}>
          <CiFloppyDisk />
        </Button>
        <Button size="xs" variant="ghost" onClick={onRemove} colorPalette="red" title="Remove">
          <CiTrash />
        </Button>
      </Flex>
    </Flex>
  )
}
