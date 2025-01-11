import { createListCollection } from '@chakra-ui/react'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select'
import { DEFAULT_WEEKS_LIST } from '@/app/constants'

interface WeeksSelectorProps {
  weeks: string[]
  setWeeks: (weeks: string[]) => void
  onFocusOutside: () => void
}

const WEEKS_COLLECTION = createListCollection({
  items: [...DEFAULT_WEEKS_LIST],
})

export const WeeksSelector = ({ weeks, setWeeks, onFocusOutside }: WeeksSelectorProps) => {
  return (
    <SelectRoot
      open
      multiple
      collection={WEEKS_COLLECTION}
      size="sm"
      width="320px"
      value={weeks}
      onValueChange={(e) => setWeeks(e.value)}
      onFocusOutside={onFocusOutside}
    >
      <SelectTrigger>
        <SelectValueText placeholder="Weeks" />
      </SelectTrigger>
      <SelectContent>
        {WEEKS_COLLECTION.items.map((week) => (
          <SelectItem item={week} key={week.value}>
            {week.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}
