import { Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Alert } from '@/components/ui/alert'
import { Indicator } from '@/app/types/models'
import { NumberInputField, NumberInputRoot } from '@/components/ui/number-input'
import { ValueChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/number-input/namespace'
import { Field } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { CiFloppyDisk, CiTrash } from 'react-icons/ci'

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
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="What indicator are you tracking?"
          helperText="Specify what you're tracking, like 'Bodyweight,' 'Savings Growth,' etc."
          className="w-full"
        >
          <Input
            size="sm"
            placeholder="E.g., Bodyweight, Savings Growth"
            value={value.content}
            onChange={(e) => handleEdit(e, 'content')}
            autoComplete="off"
            className="w-full text-sm"
          />
        </Field>

        <Field
          label="What is the unit of measurement?"
          helperText="Indicate the unit, such as kg, $, miles, etc."
          className="w-full"
        >
          <Input
            size="sm"
            placeholder="E.g., kg, $, miles"
            value={value.metric}
            onChange={(e) => handleEdit(e, 'metric')}
            autoComplete="off"
            className="w-full text-sm"
          />
        </Field>

        <Field
          label="Current value"
          helperText="Where are you starting from?"
          className="w-full"
        >
          <NumberInputRoot
            size="sm"
            step={1}
            min={0}
            value={value.initialValue?.toString() || ''}
            onValueChange={(e) => handleValueChange(e, 'initialValue')}
            className="w-full"
          >
            <NumberInputField className="text-sm" />
          </NumberInputRoot>
        </Field>

        <Field
          label="Goal value"
          helperText="What target do you want to reach?"
          className="w-full"
        >
          <NumberInputRoot
            size="sm"
            step={1}
            min={0}
            value={value.goalValue?.toString() || ''}
            onValueChange={(e) => handleValueChange(e, 'goalValue')}
            className="w-full"
          >
            <NumberInputField className="text-sm" />
          </NumberInputRoot>
        </Field>
      </div>

      {error && (
        <Alert status="error" title={error} className="text-sm mt-3" />
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onRemove}
          className="text-gray-600 hover:text-red-600"
        >
          <CiTrash size={16} className="mr-1" />
          Cancel
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleUpdate}
          loading={loading}
          className="text-gray-800"
        >
          <CiFloppyDisk size={16} className="mr-1" />
          Save
        </Button>
      </div>
    </div>
  )
}
