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
    <div className="bg-white border border-gray-200 rounded-md shadow-sm">
      <SelectRoot
        open
        collection={COLLECTION}
        size="sm"
        width="180px"
        value={[frequency.toString()]}
        onValueChange={handleOnValueChange}
        onFocusOutside={onFocusOutside}
        className="text-sm"
      >
        <SelectTrigger clearable>
          <SelectValueText placeholder="Frequency" />
        </SelectTrigger>
        <SelectContent onMouseLeave={onFocusOutside} className="max-h-64">
          {COLLECTION.items.map((item) => (
            <SelectItem
              item={item}
              key={item.value}
              className="hover:bg-gray-100 transition-colors"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </div>
  )
}
