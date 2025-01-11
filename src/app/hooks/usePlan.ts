import { useCallback, useEffect, useState } from 'react'
import { PlanClass } from '../types/PlannerClass'
import { Goal, Indicator, Plan, Status, Strategy } from '@/types'
import { DEFAULT_WEEKS } from '../constants'

export function usePlan(userId?: string): UsePlan {
  const [planInstance, setPlanInstance] = useState<PlanClass>()
  const [plan, setPlan] = useState<Plan>()
  const [goals, setGoals] = useState<Goal[]>([])
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [indicators, setIndicators] = useState<Indicator[]>([])

  const refreshState = useCallback(() => {
    if (!planInstance) return

    setPlan(planInstance.getPlan())
    setGoals(planInstance.getGoals())
    setStrategies(planInstance.getStrategies())
    setIndicators(planInstance.getIndicators())
  }, [planInstance])

  const createGoal = useCallback(
    (content = '', status = Status.ACTIVE) => {
      if (!planInstance) return

      planInstance.createGoal(content, status)
      refreshState()
    },
    [planInstance, refreshState]
  )

  const createStrategy = useCallback(
    (goalId: string, content = '', weeks = [...DEFAULT_WEEKS], status = Status.ACTIVE) => {
      if (!planInstance) return

      try {
        planInstance.createStrategy(goalId, content, weeks, status)
        refreshState()
      } catch (error: unknown) {
        console.error((error as Error).message)
      }
    },
    [planInstance, refreshState]
  )


  const createIndicator = useCallback(
    (
      goalId: string,
      content = '',
      metric = '',
      startingValue = 0,
      goalValue = 0,
      status = Status.ACTIVE
    ) => {
      if (!planInstance) return

      try {
        planInstance.createIndicator(goalId, content, metric, startingValue, goalValue, status)
        refreshState()
      } catch (error: unknown) {
        console.error((error as Error).message)
      }
    },
    [planInstance, refreshState]
  )

  const updatePlan = useCallback(
    (updates: Partial<Omit<Plan, 'id' | 'userId' | 'created'>>) => {
      if (!planInstance) return

      planInstance.updatePlan(updates)
      refreshState()
    },
    [planInstance, refreshState]
  )

  const updateGoal = useCallback(
    (id: string, updates: Partial<Goal>) => {
      if (!planInstance) return

      planInstance.updateGoal(id, updates)
      refreshState()
    },
    [planInstance, refreshState]
  )

  const updateStrategy = useCallback(
    (id: string, updates: Partial<Strategy>) => {
      if (!planInstance) return

      planInstance.updateStrategy(id, updates)
      refreshState()
    },
    [planInstance, refreshState]
  )

  const updateIndicator = useCallback(
    (id: string, updates: Partial<Indicator>) => {
      if (!planInstance) return

      planInstance.updateIndicator(id, updates)
      refreshState()
    },
    [planInstance, refreshState]
  )

  const saveGoal = useCallback(
    (goal: Goal) => {
      if (!planInstance) return

      planInstance.saveGoal(goal)
      refreshState()
    },
    [planInstance, refreshState]
  )

  const saveStrategy = useCallback(
    (strategy: Strategy) => {
      if (!planInstance) return

      planInstance.saveStrategy(strategy)
      refreshState()
    },
    [planInstance, refreshState]
  )

  const saveIndicator = useCallback(
    (indicator: Indicator) => {
      if (!planInstance) return

      planInstance.saveIndicator(indicator)
      refreshState()
    },
    [planInstance, refreshState]
  )

  useEffect(() => {
    if (userId) {
      const planInstance = new PlanClass(userId)
      setPlanInstance(planInstance)
      setPlan(planInstance.getPlan())
      refreshState()
    }
  }, [userId])

  return {
    plan: plan!,
    goals,
    strategies,
    indicators,
    createGoal,
    createStrategy,
    createIndicator,
    updatePlan,
    updateGoal,
    updateStrategy,
    updateIndicator,
    saveGoal,
    saveStrategy,
    saveIndicator,
  }
}

export interface UsePlan {
  plan: Plan
  goals: Goal[]
  strategies: Strategy[]
  indicators: Indicator[]
  createGoal: (content?: string, status?: Status) => void
  createStrategy: (
    goalId: string,
    content?: string,
    weeks?: string[],
    status?: Status
  ) => void
  createIndicator: (
    goalId: string,
    content?: string,
    metric?: string,
    startingValue?: number,
    goalValue?: number,
    status?: Status
  ) => void
  updatePlan: (updates: Partial<Omit<Plan, 'id' | 'userId' | 'created'>>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  updateStrategy: (id: string, updates: Partial<Strategy>) => void
  updateIndicator: (id: string, updates: Partial<Indicator>) => void
  saveGoal: (goal: Goal) => void
  saveStrategy: (strategy: Strategy) => void
  saveIndicator: (indicator: Indicator) => void
}
