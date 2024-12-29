'use client'
import { Box, Button, Editable, Em, Flex, IconButton, List, Separator, Text, createListCollection } from '@chakra-ui/react'
import { StepLayout } from '../step-layout'
import { useState } from 'react'
import { SlClose, SlPlus } from 'react-icons/sl'
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select'

interface Item {
  id: string
  value: string
  isEditingWeeks: boolean
  weeks: string[]
}

const _weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const DEFAULT_WEEKS = _weeks.map((id) => ({ id: id.toString(), label: `Week ${id}`, value: id.toString() }))
const __weeks = createListCollection({
  items: [...DEFAULT_WEEKS],
})
const DEFAULT__ITEM_WEEKS = _weeks.map((id) => id.toString())

const _items = [
  { id: '1', value: 'Complete my weekly project tasks by Friday', isEditingWeeks: false, weeks: [...DEFAULT__ITEM_WEEKS] },
  { id: '2', value: 'Attend a networking event every month', isEditingWeeks: false, weeks: [...DEFAULT__ITEM_WEEKS] },
  { id: '3', value: 'Read one book on leadership every quarter', isEditingWeeks: false, weeks: [...DEFAULT__ITEM_WEEKS] },
]
export function Step3() {
  const [items, setItems] = useState<Item[]>([..._items])

  const addItem = (pos?: number) => {
    const newId = (items.length + 1).toString()
    const newItem = {
      id: newId,
      value: '',
      isEditingWeeks: false,
      weeks: [...DEFAULT__ITEM_WEEKS],
    };
    const updatedItems =
      pos !== undefined
        ? [...items.slice(0, pos + 1), newItem, ...items.slice(pos + 1)]
        : [...items, newItem];

    setItems(updatedItems);
  }

  const updateItemValue = (id: string, value: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, value } : item
    )
    setItems(updatedItems)
  }

  const updateItemWeeks = (id: string, weeks: string[]) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, weeks: [...weeks].sort((a, b) => parseInt(a) - parseInt(b)) } : item
    )
    setItems(updatedItems)
  }

  const toggleItemWeeks = (id: string) => {
    setItems((items) => {
      const updatedItems = items.map((item) => {
        if (item.id === id) {
        }
        return item.id === id ? { ...item, isEditingWeeks: !item.isEditingWeeks } : item

      })
      return updatedItems
    })
  }

  const removeItem = (id: string) => {
    let updatedItems = items.filter((checkbox) => checkbox.id !== id)
    setItems(updatedItems)
  }

  return (
    <StepLayout
      title="Set your 1-Year Goals"
      description={description}
    >
      <Box flex="1" overflowY="auto" px={2} minHeight="0">
        {items.map((item) => (
          <div key={item.id}>
            <Flex key={item.id} justify="space-between">
              <Flex gap="5px" direction="column">
                <Editable.Root
                  value={item.value}
                  onValueChange={(e) => updateItemValue(item.id, e.value)}
                  placeholder="Click to edit"
                  defaultEdit
                >
                  <Editable.Preview />
                  <Editable.Input />
                </Editable.Root>
                {item.isEditingWeeks ? (
                  <WeeksSelector weeks={item.weeks} setWeeks={(weeks) => updateItemWeeks(item.id, weeks)} onFocusOutside={() => toggleItemWeeks(item.id)} />
                ) : (
                  <Text textStyle="sx" onClick={() => toggleItemWeeks(item.id)}>Due: {item.weeks.length === 12 ? 'Every week' : `Weeks ${item.weeks.join(', ')}`}</Text>
                )}
              </Flex>
              <IconButton
                aria-label="Remove list item"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
              >
                <SlClose />
              </IconButton>
            </Flex>
            <Separator />

          </div>
        ))}
      </Box>

      <Button variant="outline" className="mt-5" onClick={() => addItem()}>
        <SlPlus /> New Goal
      </Button>
    </StepLayout>
  )
}

interface WeeksSelectorProps {
  weeks: string[]
  setWeeks: (weeks: string[]) => void
  onFocusOutside: () => void
}

const WeeksSelector = ({ weeks, setWeeks, onFocusOutside }: WeeksSelectorProps) => {
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

const description = (
  <div>
    <Text textStyle="sm">Goals are the building blocks of your vision. They start with a clear action verb and are written as complete sentences. To create effective goals, follow these criteria:</Text>
    <List.Root as="ol" className="my-2">
      <List.Item><Text textStyle="sm" className="inline"><b>Specific and Measurable:</b> Clearly define what you want to achieve and how progress or success will be measured.</Text></List.Item>
      <List.Item><Text textStyle="sm" className="inline"><b>Positive Framing:</b> Write your goals as affirmations of what you will accomplish, avoiding negative language.</Text></List.Item>
      <List.Item><Text textStyle="sm" className="inline"><b>Realistic Ambition:</b> Set goals that are challenging yet attainable within the resources and time you have.</Text></List.Item>
      <List.Item><Text textStyle="sm" className="inline"><b>Time-Bound:</b> Tie each goal to a specific due date, whether it marks the completion of the objective or the execution of the action.</Text></List.Item>
    </List.Root>
    <Text textStyle="sm">Example: Instead of 'Stop procrastinating,' write 'Complete my weekly project tasks by Friday.' This ensures your goals are actionable, motivating, and directly tied to your progress.</Text>
    <Text textStyle="sm"><Em>You can add as many goals as you want, but for better results, focus on no more than three goals at a time. This will help you channel your energy and efforts effectively to maximize impact.</Em></Text>
  </div>
)
