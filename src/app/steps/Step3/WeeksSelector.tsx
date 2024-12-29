import { createListCollection } from '@chakra-ui/react'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select'

interface WeeksSelectorProps {
  weeks: string[]
  setWeeks: (weeks: string[]) => void
  onFocusOutside: () => void
}

const _weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const DEFAULT_WEEKS = _weeks.map((id) => ({ id: id.toString(), label: `Week ${id}`, value: id.toString() }))
const __weeks = createListCollection({
  items: [...DEFAULT_WEEKS],
})

export const DEFAULT_ITEM_WEEKS = _weeks.map((id) => id.toString())

export const WeeksSelector = ({ weeks, setWeeks, onFocusOutside }: WeeksSelectorProps) => {
  return (
    <SelectRoot
      open
      multiple
      collection={__weeks}
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
        {__weeks.items.map((week) => (
          <SelectItem item={week} key={week.value}>
            {week.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}
