import { createListCollection } from '@chakra-ui/react'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select'
import { DEFAULT_FREQUENCY, DEFAULT_FREQUENCY_LIST } from '@/app/constants'
import { ValueChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/select/namespace'

interface FrequencySelectorProps {
  frequency: number
  setFrequency: (frequency: number) => void
  onFocusOutside: () => void
}

const COLLECTION = createListCollection({
  items: [...DEFAULT_FREQUENCY_LIST],
})

export const FrequencySelector = ({ frequency = DEFAULT_FREQUENCY, setFrequency, onFocusOutside }: FrequencySelectorProps) => {
  const handleOnValueChange = (e: ValueChangeDetails) => {
    setFrequency(Number(e.value))
  }

  return (
    <SelectRoot
      open
      collection={COLLECTION}
      size="sm"
      width="200px"
      value={[frequency.toString()]}
      onValueChange={handleOnValueChange}
      onFocusOutside={onFocusOutside}
    >
      <SelectTrigger clearable>
        <SelectValueText placeholder="Frequency" />
      </SelectTrigger>
      <SelectContent onMouseLeave={onFocusOutside}>
        {COLLECTION.items.map((item) => (
          <SelectItem item={item} key={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}
