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
    const updatedFrequencies = [...frequencies].map((f, i) => i === index ? Boolean(details.checked) : f)
    setFrequencies(updatedFrequencies)
    debouncedUpdate({ strategyId: strategy.id, updates: { frequencies: updatedFrequencies } })
  }
  const [frequencies, setFrequencies] = useState(strategy.frequencies)

  useEffect(() => {
    if (!strategy.frequencies.length && !frequencies.length) {
      setFrequencies([...Array(frequency).keys()].map(() => false))
    }
  }, [strategy.frequencies, frequency])

  return (
    <Flex gap="5px">
      <Text fontSize="md">{content}</Text>
      {frequencies.map((value, index) => (
        <Checkbox 
          key={index} 
          size="lg" 
          defaultChecked={value} 
          onCheckedChange={(e) => handleOnCheckedChange(e, index)}
        />
      ))}
    </Flex>
  )
}
