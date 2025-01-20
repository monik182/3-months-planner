import { DEFAULT_WEEKS } from '@/app/constants'
import { StrategyForm } from '@/app/plan/Step3/Strategy/StrategyForm'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { Button, Flex } from '@chakra-ui/react'
import { Strategy } from '@prisma/client'
import cuid from 'cuid'
import { useState } from 'react'
import { SlPlus } from 'react-icons/sl'

interface StrategyListProps {
  goalId: string
  planId: string
}
export function StrategyList({ goalId, planId }: StrategyListProps) {

  const { strategyActions } = usePlanContext()
  const { data: _strategies = [] } = strategyActions.useGetByGoalId(goalId)
  const [strategies, setStrategies] = useState<Omit<Strategy, 'status'>[]>([..._strategies])

  const handleUpdate = (id: string, strategy: Partial<Strategy>) => {
    setStrategies(prev => prev.map(s => s.id === id ? { ...s, ...strategy } : s))
  }

  const handleCreate = () => {
    setStrategies(prev => [...prev, {
      id: cuid(),
      goalId,
      planId,
      content: '',
      weeks: [...DEFAULT_WEEKS],
      frequency: 7
    }])
  }

  const handleRemove = (id: string) => {
    setStrategies(prev => prev.filter(s => s.id !== id))
  }

  return (
    <Flex gap="10px" direction="column">
      {strategies.map((strategy) => (
        <StrategyForm
          key={strategy.id}
          strategy={strategy}
          onAdd={handleCreate}
          onChange={(strategy) => handleUpdate(strategy.id, strategy)}
          onRemove={() => handleRemove(strategy.id)}
        />
      ))}
      <Button size="sm" variant="outline" className="mt-5" onClick={handleCreate}>
        <SlPlus /> Add Strategy
      </Button>
    </Flex>
  )
}
