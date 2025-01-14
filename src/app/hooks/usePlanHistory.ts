import { useCallback, useEffect, useState } from 'react'
import { Goal, GoalHistory, Indicator, IndicatorHistory, Plan, Strategy, StrategyHistory } from '@/app/types/types'
import { PlanHistoryClass } from '@/app/types/PlanHistoryClass'

export function usePlanHistory(plan: Plan, goals: Goal[], strategies: Strategy[], indicators: Indicator[]): UsePlanHistory {
  const [planInstance, setPlanInstance] = useState<PlanHistoryClass>()
  const [goalsHistory, setGoalsHistory] = useState<GoalHistory[]>([])
  const [strategiesHistory, setStrategiesHistory] = useState<StrategyHistory[]>([])
  const [indicatorsHistory, setIndicatorsHistory] = useState<IndicatorHistory[]>([])

  const refreshState = useCallback(() => {
    if (!planInstance) return
    setGoalsHistory(planInstance.getGoals())
    setStrategiesHistory(planInstance.getStrategies())
    setIndicatorsHistory(planInstance.getIndicators())
  }, [planInstance])

  const updateStrategy = useCallback(
    (id: string, updates: Partial<StrategyHistory>) => {
      if (!planInstance) return

      planInstance.updateStrategy(id, updates)
      refreshState()
    },
    [planInstance, refreshState]
  )

  const updateIndicator = useCallback(
    (id: string, updates: Partial<IndicatorHistory>) => {
      if (!planInstance) return

      planInstance.updateIndicator(id, updates)
      refreshState()
    },
    [planInstance, refreshState]
  )

  useEffect(() => {
    if (plan && goals && strategies && indicators) {
      setPlanInstance(new PlanHistoryClass(plan, goals, strategies, indicators))
      refreshState()
    }
  }, [plan, goals, strategies, indicators])

  return {
    goals: goalsHistory,
    strategies: strategiesHistory,
    indicators: indicatorsHistory,
    updateStrategy,
    updateIndicator,
  }
}

export interface UsePlanHistory {
  goals: GoalHistory[]
  strategies: StrategyHistory[]
  indicators: IndicatorHistory[]
  updateStrategy: (id: string, updates: Partial<Strategy>) => void
  updateIndicator: (id: string, updates: Partial<Indicator>) => void
}
