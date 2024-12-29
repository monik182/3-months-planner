'use client'
import { Box, Button, Card, Editable, Em, Flex, IconButton, List, Text } from '@chakra-ui/react'
import { StepLayout } from '../step-layout'
import { useState } from 'react'
import { SlClose, SlPlus } from 'react-icons/sl'
import { DEFAULT_ITEM_WEEKS } from './WeeksSelector'
import { DEFAULT_INDICATOR, Indicator, IndicatorItem } from './Indicator'

interface Item {
  id: string
  value: string
  isEditingWeeks: boolean
  dueDate?: string // TODO: this must be required
  indicators: IndicatorItem[]
}

const _items = [
  { id: '1', value: 'Complete my weekly project tasks by Friday', isEditingWeeks: false, weeks: [...DEFAULT_ITEM_WEEKS], indicators: [] },
  { id: '2', value: 'Attend a networking event every month', isEditingWeeks: false, weeks: [...DEFAULT_ITEM_WEEKS], indicators: [] },
  { id: '3', value: 'Read one book on leadership every quarter', isEditingWeeks: false, weeks: [...DEFAULT_ITEM_WEEKS], indicators: [] },
]
export function Step3() {
  const [items, setItems] = useState<Item[]>([..._items])
  const disableIndicator = (item: Item) => !!item.indicators.some((indicator) => indicator.isEditing)

  const addItem = (pos?: number) => {
    const newId = (items.length + 1).toString()
    const newItem = {
      id: newId,
      value: '',
      isEditingWeeks: false,
      weeks: [...DEFAULT_ITEM_WEEKS],
      indicators: [],
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

  const removeItem = (id: string) => {
    let updatedItems = items.filter((checkbox) => checkbox.id !== id)
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

  const handleAddIndicator = (id: string) => {
    setItems(items => {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, indicators: [...item.indicators, { ...DEFAULT_INDICATOR, isEditing: true }] } : item
      )
      return updatedItems
    })
  }

  const handleIndicatorChange = (id: string, index: number, measurement: IndicatorItem) => {
    setItems(items => {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, indicators: item.indicators.map((m, i) => (i === index ? measurement : m)) } : item
      )
      return updatedItems
    })
  }

  const handleRemoveIndicator = (id: string, index: number) => {
    setItems(items => {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, indicators: item.indicators.filter((_, i) => i !== index) } : item
      )
      return updatedItems
    })
  }

  return (
    <StepLayout
      title="Set your 1-Year Goals"
      description={description}
    >
      <Box flex="1" overflowY="auto" px={2} minHeight="0">
        {items.map((item) => (
          <Card.Root key={item.id} marginBottom="1rem">
            <Card.Header>
              <Flex key={item.id} justify="space-between">
                <Editable.Root
                  value={item.value}
                  onValueChange={(e) => updateItemValue(item.id, e.value)}
                  placeholder="Click to edit"
                  defaultEdit
                  width="100%"
                >
                  <Editable.Preview />
                  <Editable.Input />
                </Editable.Root>
                <IconButton
                  aria-label="Remove list item"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  <SlClose />
                </IconButton>
              </Flex>
            </Card.Header>
            <Card.Body>
              HERE COME THE Strategies
            </Card.Body>
            <Card.Footer>
              <Flex direction="column" gap="10px">
                {item.indicators.map((indicator, index) => (
                  <Indicator
                    key={index}
                    indicator={indicator}
                    onRemove={() => handleRemoveIndicator(item.id, index)}
                    onChange={(indicator) => handleIndicatorChange(item.id, index, indicator)}
                  />
                ))}
                <Button variant="outline" className="mt-5" onClick={() => handleAddIndicator(item.id)} disabled={disableIndicator(item)}>
                  <SlPlus /> Add Indicator
                </Button>
              </Flex>
            </Card.Footer>
          </Card.Root>
        ))}
      </Box>

      <Button variant="outline" className="mt-5" onClick={() => addItem()}>
        <SlPlus /> New Goal
      </Button>
    </StepLayout>
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
