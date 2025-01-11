import { getNextStartDates } from '@/app/util';
import { Flex, createListCollection, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface DateSelectorProps {
  onChange: (value: string) => void
  date: string
}

export function DateSelector({ onChange, date }: DateSelectorProps) {
  const [value, setValue] = useState<string[]>([date])
  const [checked, setChecked] = useState(false)

  const dates = getNextStartDates(checked)

  const options = dates.map(date => {
    return {
      value: date,
      label: dayjs(date).format('MMMM DD, YYYY')
    }
  })

  const optionsCollection = createListCollection({
    items: options
  })

  const handleChange = (e: any) => {
    setValue(e.value)
    onChange(e.value[0])
  }

  useEffect(() => {
    setValue([date])
  }, [date])

  return (
    <Flex gap="1rem" align="end">
      <SelectRoot
        collection={optionsCollection}
        value={value}
        onValueChange={handleChange}
      >
        <SelectLabel>Start Date</SelectLabel>
        <SelectTrigger>
          <SelectValueText placeholder="Select start date" />
        </SelectTrigger>
        <SelectContent>
          {optionsCollection.items.map((date) => (
            <SelectItem item={date} key={date.value}>
              {date.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
      <Flex align="center" gap="5px">
        <Switch size="xs" checked={checked} onCheckedChange={(e) => setChecked(e.checked)} /> <Text textStyle="xs">Start on Mondays</Text>
      </Flex>
    </Flex>
  )
}
