'use client'
import { Box, Button, Editable, Flex, IconButton, List, Text } from '@chakra-ui/react';
import { StepLayout } from './step-layout';
import { useState } from 'react';
import { SlClose, SlPlus } from 'react-icons/sl';

interface Item {
  id: string
  value: string
}
export function Step3() {
  const [items, setItems] = useState<Item[]>([])

  const addItem = (pos?: number) => {
    let updatedItems
    const newId = (items.length + 1).toString()

    if (pos !== undefined) {
      updatedItems = [
        ...items.slice(0, pos + 1),
        { id: newId, value: '' },
        ...items.slice(pos + 1),
      ]
    } else {
      updatedItems = [
        ...items,
        { id: newId, value: '' },
      ]
    }

    setItems(updatedItems)
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

  return (
    <StepLayout
      title="Set your 1-Year Goals"
      description={description}
    >
      <Box flex="1" overflowY="auto" px={2} minHeight="0">
        {items.map((item) => (
          <Flex key={item.id} justify="space-between">
            <Flex gap="5px">
              <Editable.Root
                value={item.value}
                onValueChange={(e) => updateItemValue(item.id, e.value)}
                placeholder="Click to edit"
                defaultEdit
              >
                <Editable.Preview />
                <Editable.Input />
              </Editable.Root>
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
    <p>Goals are the building blocks of your vision. They start with a clear action verb and are written as complete sentences. To create effective goals, follow these criteria:</p>
    <List.Root as="ol" className="my-2">
      <List.Item><Text fontWeight="semibold" className="inline">Specific and Measurable:</Text> Clearly define what you want to achieve and how progress or success will be measured.</List.Item>
      <List.Item><Text fontWeight="semibold" className="inline">Positive Framing:</Text> Write your goals as affirmations of what you will accomplish, avoiding negative language.</List.Item>
      <List.Item><Text fontWeight="semibold" className="inline">Realistic Ambition:</Text> Set goals that are challenging yet attainable within the resources and time you have.</List.Item>
      <List.Item><Text fontWeight="semibold" className="inline">Time-Bound:</Text> Tie each goal to a specific due date, whether it marks the completion of the objective or the execution of the action.</List.Item>
    </List.Root>
    <p>Example: Instead of 'Stop procrastinating,' write 'Complete my weekly project tasks by Friday.' This ensures your goals are actionable, motivating, and directly tied to your progress.</p>
  </div>
)
