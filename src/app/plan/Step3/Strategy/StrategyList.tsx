import { DEFAULT_WEEKS } from '@/app/constants'
import { StrategyForm } from '@/app/plan/Step3/Strategy/StrategyForm'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { Status } from '@/app/types/types'
import { SavingSpinner } from '@/components/SavingSpinner'
import { Button, Flex } from '@chakra-ui/react'
import { Strategy } from '@prisma/client'
import cuid from 'cuid'
import { useEffect, useState } from 'react'
import { SlPlus } from 'react-icons/sl'
import { useDebouncedCallback } from 'use-debounce'

interface StrategyListProps {
  goalId: string
  planId: string
  onLoading?: (loading: boolean) => void
}

export function StrategyList({ goalId, planId, onLoading }: StrategyListProps) {
  const { strategyActions } = usePlanContext()
  const { data: _strategies = [], isLoading } = strategyActions.useGetByGoalId(goalId)
  const [strategies, setStrategies] = useState<Omit<Strategy, 'status'>[]>([..._strategies])
  const create = strategyActions.useCreate()
  const update = strategyActions.useUpdate()
  const loading = create.isPending || update.isPending

  const handleUpdate = (id: string, strategy: Partial<Strategy>) => {
    setStrategies(prev => prev.map(s => s.id === id ? { ...s, ...strategy } : s))
    debouncedUpdate(id, strategy)
  }

  const handleCreate = () => {
    const newStrategy = {
      id: cuid(),
      goalId,
      planId,
      content: '',
      weeks: [...DEFAULT_WEEKS],
      frequency: 7
    }
    setStrategies(prev => [...prev, newStrategy])
    debouncedSave(newStrategy)
  }

  const handleRemove = (id: string) => {
    setStrategies(prev => prev.filter(s => s.id !== id))
    debouncedRemove(id)
  }

  const saveStrategy = (strategy: Omit<Strategy, 'status'>) => {
    create.mutate({ ...strategy, goal: { connect: { id: goalId } } })
  }

  const updateStrategy = (id: string, updates: Partial<Strategy>) => {
    update.mutate({ strategyId: id, updates })
  }

  const updateState = (id: string) => {
    update.mutate({ strategyId: id, updates: { status: Status.DELETED } })
  }

  const debouncedSave = useDebouncedCallback((strategy: Omit<Strategy, 'status'>) => saveStrategy(strategy), 1000)
  const debouncedUpdate = useDebouncedCallback((id: string, updates: Partial<Strategy>) => updateStrategy(id, updates), 500)
  const debouncedRemove = useDebouncedCallback((id: string) => updateState(id), 0)

  useEffect(() => {
    if (!isLoading && !strategies.length) {
      setStrategies(_strategies)
    }
  }, [_strategies, strategies, isLoading])

  useEffect(() => {
    onLoading?.(loading)
  }, [loading])

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
      <SavingSpinner loading={loading} />
      <Button size="sm" variant="outline" className="mt-5" onClick={handleCreate}>
        <SlPlus /> Add Strategy
      </Button>
    </Flex>
  )
}
