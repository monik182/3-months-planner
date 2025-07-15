import { createListCollection } from '@chakra-ui/react'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select'
import { DEFAULT_WEEKS, DEFAULT_WEEKS_LIST } from '@/app/constants'
import { ValueChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/select/namespace'

interface WeeksSelectorProps {
  weeks: string[]
  setWeeks: (weeks: string[]) => void
  onFocusOutside: () => void
}

const WEEKS_COLLECTION = createListCollection({
  items: [...DEFAULT_WEEKS_LIST],
})

export const WeeksSelector = ({ weeks, setWeeks, onFocusOutside }: WeeksSelectorProps) => {
  const handleOnValueChange = (e: ValueChangeDetails) => {
    setWeeks(e.value)
  }

  const handleOnOpenChange = () => {
    const hasValues = weeks.length > 0
    if (!hasValues) {
      setWeeks([...DEFAULT_WEEKS])
    }
  }

  return (
    <div className="relative z-50 bg-white border border-gray-200 rounded-md shadow-sm">
      <SelectRoot
        open
        multiple
        collection={WEEKS_COLLECTION}
        size="sm"
        width="180px"
        value={weeks}
        onValueChange={handleOnValueChange}
        onFocusOutside={onFocusOutside}
        onOpenChange={handleOnOpenChange}
        className="text-sm"
      >
        <SelectTrigger clearable>
          <SelectValueText placeholder="Weeks" />
        </SelectTrigger>
        <SelectContent
          portalled={false}
          onMouseLeave={onFocusOutside}
          className="max-h-64 overflow-auto"
        >
          <div className="p-1 border-b border-gray-100 mb-1">
            <button
              className="w-full text-xs py-1 px-2 text-left text-gray-600 hover:bg-gray-50 rounded"
              onClick={() => setWeeks([...DEFAULT_WEEKS])}
            >
              Select All
            </button>
            <button
              className="w-full text-xs py-1 px-2 text-left text-gray-600 hover:bg-gray-50 rounded"
              onClick={() => setWeeks([])}
            >
              Clear All
            </button>
          </div>
          {WEEKS_COLLECTION.items.map((week) => (
            <SelectItem
              item={week}
              key={week.value}
              className="hover:bg-gray-100 transition-colors"
            >
              {week.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </div>
  )
}
