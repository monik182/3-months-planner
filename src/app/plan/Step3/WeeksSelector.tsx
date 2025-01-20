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
    <SelectRoot
      open
      multiple
      collection={WEEKS_COLLECTION}
      size="sm"
      width="200px"
      value={weeks}
      onValueChange={handleOnValueChange}
      onFocusOutside={onFocusOutside}
      onOpenChange={handleOnOpenChange}
    >
      <SelectTrigger clearable>
        <SelectValueText placeholder="Weeks" />
      </SelectTrigger>
      <SelectContent onMouseLeave={onFocusOutside}>
        {WEEKS_COLLECTION.items.map((week) => (
          <SelectItem item={week} key={week.value}>
            {week.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}
