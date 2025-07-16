import { StrategyHistoryExtended } from '@/app/types/types'
import { Checkbox } from '@/components/ui/checkbox'
import { UseUpdate } from '@/app/hooks/useStrategyHistoryActions'
import { CheckedChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/checkbox/namespace'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Flex, Text } from '@chakra-ui/react'

interface StrategyDetailProps {
  strategy: StrategyHistoryExtended
  onChange: UseUpdate['mutate']
}
export function StrategyDetail({ strategy, onChange }: StrategyDetailProps) {
  const { content, frequency } = strategy.strategy
  const debouncedUpdate = useDebouncedCallback((updates) => onChange(updates), 1000)
  const handleOnCheckedChange = (details: CheckedChangeDetails, index: number) => {
    const updatedFrequencies = [...frequencies].map((f, i) =>
      i === index ? Boolean(details.checked) : f
    )
    setFrequencies(updatedFrequencies)
    debouncedUpdate({ strategyId: strategy.id, updates: { frequencies: updatedFrequencies } })
  }
  const [frequencies, setFrequencies] = useState(strategy.frequencies)

  useEffect(() => {
    let newFrequencies = strategy.frequencies

    if (!strategy.frequencies.length) {
      newFrequencies = [...Array(frequency).keys()].map(() => false)
    } else if (strategy.frequencies.length !== frequency) {
      if (strategy.frequencies.length < frequency) {
        newFrequencies = [
          ...strategy.frequencies,
          ...Array(frequency - strategy.frequencies.length).fill(false),
        ]
      } else {
        newFrequencies = strategy.frequencies.slice(0, frequency)
      }
      debouncedUpdate({ strategyId: strategy.id, updates: { frequencies: newFrequencies } })
    }

    setFrequencies(newFrequencies)
  }, [strategy.frequencies, frequency])

  return (
    <Flex gap="5px" flexDirection={{ base: "column", lg: "row" }}>
      <Text fontSize="md">{content}</Text>
      <Flex gap="5px">
        {frequencies.map((value, index) => (
          <Checkbox
            key={index}
            size="lg"
            checked={value}
            variant="subtle"
            onCheckedChange={(e) => handleOnCheckedChange(e, index)}
            padding="4px"
            borderRadius="50%"
            cursor="pointer"
          />
        ))}
      </Flex>
    </Flex>
  )
}
