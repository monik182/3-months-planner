'use client'
import { v4 as uuidv4 } from 'uuid'
import { Box, Button, Card, Editable, Em, Flex, IconButton, List, Text } from '@chakra-ui/react'
import { StepLayout } from '../step-layout'
import { useState } from 'react'
import { SlClose, SlPlus } from 'react-icons/sl'
import { DEFAULT_INDICATOR, Indicator } from './Indicator'
import { Strategy } from './Strategy'
import { Indicator as IndicatorItem, Goal, Strategy as StrategyItem, Step } from '@/types'
import { DEFAULT_STRATEGY } from '@/constants'

const _items = [
  { id: uuidv4(), value: 'Complete my weekly project tasks by Friday', isEditingWeeks: false, indicators: [], strategies: [{ ...DEFAULT_STRATEGY }] },
  { id: uuidv4(), value: 'Attend a networking event every month', isEditingWeeks: false, indicators: [], strategies: [{ ...DEFAULT_STRATEGY }] },
  { id: uuidv4(), value: 'Read one book on leadership every quarter', isEditingWeeks: false, indicators: [], strategies: [{ ...DEFAULT_STRATEGY }] },
]
export function Step3({ goNext, onChange }: Step<Goal[]>) {
  const [items, setItems] = useState<Goal[]>([..._items])
  const disableIndicator = (item: Goal) => !!item.indicators.some((indicator) => indicator.isEditing)

  const addItem = (pos?: number) => {
    const newId = uuidv4()
    const newItem = {
      id: newId,
      value: '',
      isEditingWeeks: false,
      indicators: [],
      strategies: [{ ...DEFAULT_STRATEGY, id: uuidv4() }],
    }
    const updatedItems =
      pos !== undefined
        ? [...items.slice(0, pos + 1), newItem, ...items.slice(pos + 1)]
        : [...items, newItem]

    setItems(updatedItems)
    onChange(updatedItems)
  }

  const updateItemValue = (id: string, value: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, value } : item
    )
    setItems(updatedItems)
    onChange(updatedItems)
  }

  const removeItem = (id: string) => {
    let updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)
    onChange(updatedItems)
  }

  const handleAddIndicator = (id: string) => {
    setItems(items => {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, indicators: [...item.indicators, { ...DEFAULT_INDICATOR, isEditing: true }] } : item
      )
      onChange(updatedItems)
      return updatedItems
    })
  }

  const handleIndicatorChange = (id: string, index: number, measurement: IndicatorItem) => {
    setItems(items => {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, indicators: item.indicators.map((m, i) => (i === index ? measurement : m)) } : item
      )
      onChange(updatedItems)
      return updatedItems
    })
  }

  const handleRemoveIndicator = (id: string, index: number) => {
    setItems(items => {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, indicators: item.indicators.filter((_, i) => i !== index) } : item
      )
      onChange(updatedItems)
      return updatedItems
    })
  }

  const handleAddStrategy = (id: string) => {
    setItems(items => {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, strategies: [...item.strategies, { ...DEFAULT_STRATEGY, id: uuidv4() }] } : item
      )
      onChange(updatedItems)
      return updatedItems
    })
  }

  const handleUpdateStrategy = (id: string, strategy: StrategyItem) => {
    setItems(items => {
      const updatedItems = items.map((item) => {
        if (item.id === id) {
          if (!strategy.id) {
            strategy.id = uuidv4()
          }
          return { ...item, strategies: item.strategies.map((s) => (s.id === strategy.id ? strategy : s)) }
        }
        return item
      })
      onChange(updatedItems)
      return updatedItems
    })
  }

  const handleRemoveStrategy = (id: string, strategyId: string) => {
    setItems(items => {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, strategies: item.strategies.filter((s) => s.id !== strategyId) } : item
      )
      onChange(updatedItems)
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
              <Flex direction="column" gap="10px">
                {item.strategies.map((strategy, index) => (
                  <Strategy
                    key={index}
                    strategy={strategy}
                    onAdd={() => handleAddStrategy(item.id)}
                    onChange={(strategy) => handleUpdateStrategy(item.id, strategy)}
                    onRemove={() => index < item.strategies.length - 1 ? handleRemoveStrategy(item.id, strategy.id) : undefined}
                  />
                ))}
              </Flex>
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
                <Button size="xs" variant="outline" className="mt-5" onClick={() => handleAddIndicator(item.id)} disabled={disableIndicator(item)}>
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
