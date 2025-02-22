import { DEFAULT_WEEKS } from '@/app/constants'
import { StrategyForm } from '@/app/plan/Step3/Strategy/StrategyForm'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { Status } from '@/app/types/types'
import { SavingSpinner } from '@/components/SavingSpinner'
import { Alert, Button, Flex } from '@chakra-ui/react'
import { Strategy } from '@prisma/client'
import cuid from 'cuid'
import { useEffect, useState } from 'react'
import { SlPlus } from 'react-icons/sl'
import { useDebouncedCallback } from 'use-debounce'

interface StrategyListProps {
  goalId: string
  planId: string
  maxLimit?: number
  onLoading?: (loading: boolean) => void
}

export function StrategyList({ goalId, planId, maxLimit, onLoading }: StrategyListProps) {
  const { strategyActions } = usePlanContext()
  const { data: _strategies = [] } = strategyActions.useGetByGoalId(goalId)
  const [strategies, setStrategies] = useState<Strategy[]>([..._strategies])
  const create = strategyActions.useCreate()
  const update = strategyActions.useUpdate()
  const remove = strategyActions.useDelete()
  const loadingText = create.isPending ? 'Creating' : 'Saving'
  const loading = create.isPending || update.isPending || remove.isPending
  const canAdd = maxLimit ? strategies.length < maxLimit : true

  const handleUpdate = (id: string, strategy: Partial<Strategy>) => {
    setStrategies(prev => prev.map(s => s.id === id ? { ...s, ...strategy } : s))
    debouncedUpdate(id, strategy)
  }

  const handleCreate = () => {
    if (!canAdd) return

    const newStrategy = {
      id: cuid(),
      goalId,
      planId,
      content: '',
      weeks: [...DEFAULT_WEEKS],
      frequency: 7,
      status: Status.ACTIVE,
    }
    debouncedSave(newStrategy)
  }

  const handleRemove = (id: string) => {
    setStrategies(prev => prev.filter(s => s.id !== id))
    debouncedRemove(id)
  }

  const saveStrategy = (strategy: Strategy) => {
      create.mutate(strategy, {
      onSuccess: () => {
        setStrategies(prev => [...prev, strategy])
      }
    })
  }

  const updateStrategy = (id: string, updates: Partial<Strategy>) => {
    update.mutate({ strategyId: id, updates })
  }

  const removeStrategy = (id: string) => {
    remove.mutate(id)
  }

  const debouncedSave = useDebouncedCallback((strategy: Strategy) => saveStrategy(strategy), 0)
  const debouncedUpdate = useDebouncedCallback((id: string, updates: Partial<Strategy>) => updateStrategy(id, updates), 500)
  const debouncedRemove = useDebouncedCallback((id: string) => removeStrategy(id), 0)

  useEffect(() => {
    onLoading?.(loading)
  }, [loading])

  useEffect(() => {
    setStrategies(prev => {
      if (!prev.length) return _strategies
      if (prev.length !== _strategies.length) return _strategies
      return prev
    })
  }, [_strategies])

  return (
    <Flex gap="10px" direction="column">
      {strategies.map((strategy) => (
        <StrategyForm
          key={strategy.id}
          onAdd={handleCreate}
          strategy={strategy}
          onChange={(strategy) => handleUpdate(strategy.id, strategy)}
          onRemove={() => handleRemove(strategy.id)}
        />
      ))}
      <Button size="xs" variant="ghost" className="mt-5" onClick={handleCreate} disabled={!canAdd}>
        <SlPlus /> Add Strategy
      </Button>
      <SavingSpinner loading={loading} text={loadingText} />
      {!canAdd && (
        <Alert.Root status="info" size="sm" variant="outline">
          <Alert.Indicator />
          <Alert.Title>
            You have reached the maximum number of strategies for this goal
          </Alert.Title>
        </Alert.Root>
      )}
    </Flex>
  )
}
