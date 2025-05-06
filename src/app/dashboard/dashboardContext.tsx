'use client'
import React, { createContext, useContext, useMemo } from 'react'
import { UseGoalHistoryActions, useGoalHistoryActions } from '@/app/hooks/useGoalHistoryActions'
import { UseStrategyHistoryActions, useStrategyHistoryActions } from '@/app/hooks/useStrategyHistoryActions'
import { UseIndicatorHistoryActions, useIndicatorHistoryActions } from '@/app/hooks/useIndicatorHistoryActions'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { GoalHistoryExtended, IndicatorHistoryExtended, StrategyHistoryExtended } from '@/app/types/types'
import { DEFAULT_WEEKS } from '@/app/constants'
import { calculateCompletionScore } from '@/app/util'

type DashboardContextType = {
  isLoading: boolean,
  isRefetching: boolean,
  isLoadingGoals: boolean,
  isLoadingStrategies: boolean,
  isLoadingIndicators: boolean,
  weeklyScores: number[],
  planScore: number,
  overallGoalScores: Map<string, number>,
  overallStrategyScores: Map<string, number>,
  goals: GoalHistoryExtended[] | undefined,
  strategies: StrategyHistoryExtended[] | undefined,
  indicators: IndicatorHistoryExtended[] | undefined,
  goalHistoryActions: UseGoalHistoryActions,
  strategyHistoryActions: UseStrategyHistoryActions,
  indicatorHistoryActions: UseIndicatorHistoryActions,
  getStrategiesByGoalId: (goalId: string, seq?: string) => StrategyHistoryExtended[],
  getIndicatorsByGoalId: (goalId: string, seq?: string) => IndicatorHistoryExtended[],
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

interface DashboardTrackingProviderProps {
  children: React.ReactNode
}

export const DashboardProvider = ({ children }: DashboardTrackingProviderProps) => {
  const { plan } = usePlanContext()
  const goalHistoryActions = useGoalHistoryActions()
  const strategyHistoryActions = useStrategyHistoryActions()
  const indicatorHistoryActions = useIndicatorHistoryActions()
  const goals = goalHistoryActions.useGetByPlanId(plan?.id as string)
  const strategies = strategyHistoryActions.useGetByPlanId(plan?.id as string)
  const indicators = indicatorHistoryActions.useGetByPlanId(plan?.id as string)
  const isLoading = goals.isLoading || strategies.isLoading || indicators.isLoading
  const isRefetching = goals.isRefetching || strategies.isRefetching || indicators.isRefetching

  const { strategiesByGoal, indicatorsByGoal, weeklyScores, overallGoalScores, overallStrategyScores, planScore } = useMemo(() => {
    const strategiesByGoal = new Map<string, StrategyHistoryExtended[]>()
    const indicatorsByGoal = new Map<string, IndicatorHistoryExtended[]>()
    const goalScores = new Map()
    const strategyScores = new Map();

    (strategies.data || []).forEach(strategy => {
      const goalId = strategy.strategy.goalId
      if (!strategiesByGoal.has(goalId)) {
        strategiesByGoal.set(goalId, [])
      }
      strategiesByGoal.get(goalId)!.push(strategy)
    });

    (indicators.data || []).forEach(indicator => {
      const goalId = indicator.indicator.goalId
      if (!indicatorsByGoal.has(goalId)) {
        indicatorsByGoal.set(goalId, [])
      }
      indicatorsByGoal.get(goalId)!.push(indicator)
    })

    const weeklyScores = DEFAULT_WEEKS.map((week) => {
      const filteredGoals = (goals.data || []).filter((g) => g.sequence.toString() === week)

      const goalsScore = filteredGoals.map((goal) => {
        const filteredStrategies = (strategies.data || []).filter(
          (s) => s.sequence.toString() === week &&
            s.strategy.goalId === goal.goalId &&
            s.strategy.weeks.includes(week)
        )

        const strategiesScore = calculateCompletionScore(filteredStrategies)

        const prevGoalScore = goalScores.get(goal.goalId) || 0
        goalScores.set(goal.goalId, prevGoalScore + strategiesScore)

        filteredStrategies.forEach((strategy) => {
          const prevStrategyScore = strategyScores.get(strategy.strategyId) || 0
          const strategyScore = calculateCompletionScore([strategy])
          strategyScores.set(strategy.strategyId, prevStrategyScore + strategyScore)
        })

        return strategiesScore
      })

      const weekScores = Math.floor(goalsScore.reduce((acc, score) => acc + score, 0) / (filteredGoals.length || 1))
      return weekScores
    })

    // Calculate the average plan score
    const planScore = Math.floor(weeklyScores.reduce((acc, score) => acc + score, 0) / weeklyScores.length)

    return {
      strategiesByGoal,
      indicatorsByGoal,
      weeklyScores,
      planScore,
      overallGoalScores: goalScores,
      overallStrategyScores: strategyScores,
    }
  }, [goals.data, strategies.data, indicators.data])

  const getStrategiesByGoalId = (goalId: string, seq?: string) => {
    const strategies = strategiesByGoal.get(goalId) || []
    return seq 
      ? strategies.filter(s => 
          s.sequence.toString() === seq && 
          s.strategy.weeks.includes(seq)
        ) 
      : strategies
  }

  const getIndicatorsByGoalId = (goalId: string, seq?: string) => {
    const indicators = indicatorsByGoal.get(goalId) || []
    return seq ? indicators.filter(i => i.sequence.toString() === seq) : indicators
  }

  return (
    <DashboardContext.Provider
      value={{
        goals: goals.data,
        strategies: strategies.data,
        indicators: indicators.data,
        weeklyScores,
        planScore,
        overallGoalScores,
        overallStrategyScores,
        isLoading,
        isRefetching,
        isLoadingGoals: goals.isLoading || goals.isRefetching,
        isLoadingStrategies: strategies.isLoading || strategies.isRefetching,
        isLoadingIndicators: indicators.isLoading || indicators.isRefetching,
        goalHistoryActions,
        strategyHistoryActions,
        indicatorHistoryActions,
        getStrategiesByGoalId,
        getIndicatorsByGoalId,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboardContext = (): DashboardContextType => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
