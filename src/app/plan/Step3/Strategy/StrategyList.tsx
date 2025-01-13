import { StrategyForm } from '@/app/plan/Step3/Strategy/StrategyForm'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { Button, Flex } from '@chakra-ui/react'
import { Strategy } from '@prisma/client'
import { useMemo } from 'react'
import { SlPlus } from 'react-icons/sl'
import { useDebouncedCallback } from 'use-debounce'

interface StrategyListProps {
  goalId: string
  planId: string
}
export function StrategyList({ goalId, planId }: StrategyListProps) {

  const { plan } = usePlanContext()
  const { strategies, createStrategy, updateStrategy, removeStrategy } = plan
  const filteredStrategies = useMemo(
    () => strategies.filter((strategy) => strategy.goalId === goalId),
    [strategies, goalId]
  )

  const handleUpdateDebounced = useDebouncedCallback((id: string,strategy: Partial<Strategy>) => {
    updateStrategy(id, strategy)
  }, 1000)

  const handleCreate = () => {
    createStrategy(goalId, planId)
  }

  const handleRemove = (id: string) => {
    removeStrategy(id)
  }

  return (
    <Flex gap="10px" direction="column">
      {filteredStrategies.map((strategy) => (
        <StrategyForm
          key={strategy.id}
          strategy={strategy}
          onAdd={handleCreate}
          onChange={(strategy) => handleUpdateDebounced(strategy.id, strategy)}
          onRemove={() => handleRemove(strategy.id)}
        />
      ))}
      <Button size="sm" variant="outline" className="mt-5" onClick={() => createStrategy(goalId, planId)}>
        <SlPlus /> Add Strategy
      </Button>
    </Flex>
  )
}
