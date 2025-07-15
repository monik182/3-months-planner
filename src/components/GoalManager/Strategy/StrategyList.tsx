import { DEFAULT_WEEKS } from '@/app/constants'
import { StrategyForm } from '@/components/GoalManager/Strategy/StrategyForm'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { EntityType, Status } from '@/app/types/types'
import { SavingSpinner } from '@/components/SavingSpinner'
import { Alert, Button } from '@chakra-ui/react'
import { Strategy } from '@prisma/client'
import cuid from 'cuid'
import { useEffect, useState, useMemo } from 'react'
import { GoPlus } from 'react-icons/go'
import { useDebouncedCallback } from 'use-debounce'

interface StrategyListProps {
  goalId: string
  planId: string
  maxLimit?: number
  onEdit?: (entityType: EntityType, entity: any) => void
  onLoading?: (loading: boolean) => void
}

export function StrategyList({ goalId, planId, maxLimit, onEdit, onLoading }: StrategyListProps) {
  const { strategyActions, strategies } = usePlanContext()
  const goalStrategies = useMemo(
    () => strategies.filter((s) => s.goalId === goalId),
    [strategies, goalId]
  )
  const [strategies, setStrategies] = useState<Strategy[]>([...goalStrategies])
  const [activeStrategy, setActiveStrategy] = useState<string | null>(null)

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
    setActiveStrategy(newStrategy.id)
  }

  const handleRemove = (id: string) => {
    setStrategies(prev => prev.filter(s => s.id !== id))
    debouncedRemove(id)
  }

  const saveStrategy = (strategy: Strategy) => {
    create.mutate(strategy, {
      onSuccess: (newStrategy) => {
        setStrategies(prev => [...prev, strategy])
        onEdit?.(EntityType.Strategy, newStrategy)
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

  const toggleActive = (id: string) => {
    setActiveStrategy(prev => prev === id ? null : id)
  }

  useEffect(() => {
    onLoading?.(loading)
  }, [loading])

  useEffect(() => {
    setStrategies(prev => {
      if (!prev.length) return goalStrategies
      if (prev.length !== goalStrategies.length) return goalStrategies
      return prev
    })
  }, [goalStrategies.length])

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className={`border rounded-md transition-colors ${activeStrategy === strategy.id ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}`}
          >
            <StrategyForm
              strategy={strategy}
              onChange={(strategy) => handleUpdate(strategy.id, strategy)}
              onRemove={() => handleRemove(strategy.id)}
              onAdd={handleCreate}
              onClick={() => toggleActive(strategy.id)}
              isActive={activeStrategy === strategy.id}
            />
          </div>
        ))}
      </div>

      {strategies.length === 0 && (
        <div className="text-sm text-gray-500 p-2">
          No actions added yet. Add an action to support your goal.
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button
          size="xs"
          variant="outline"
          onClick={handleCreate}
          disabled={!canAdd}
          className="text-xs"
        >
          <GoPlus size={14} className="mr-1" />
          Add Action
        </Button>

        <SavingSpinner loading={loading} text={loadingText} />
      </div>

      {!canAdd && (
        <Alert.Root status="info" size="sm" variant="outline" className="mt-2">
          <Alert.Indicator />
          <Alert.Title className="text-xs">
            Maximum {maxLimit} actions per goal
          </Alert.Title>
        </Alert.Root>
      )}
    </div>
  )
}
