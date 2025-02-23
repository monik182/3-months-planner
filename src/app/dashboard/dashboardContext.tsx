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
  isLoadingGoals: boolean,
  isLoadingStrategies: boolean,
  isLoadingIndicators: boolean,
  weeklyScores: number[],
  overallGoalScores: Map<string, number>,
  overallStrategyScores: Map<string, number>,
  goals: GoalHistoryExtended[] | undefined,
  strategies: StrategyHistoryExtended[] | undefined,
  indicators: IndicatorHistoryExtended[] | undefined,
  goalHistoryActions: UseGoalHistoryActions
  strategyHistoryActions: UseStrategyHistoryActions
  indicatorHistoryActions: UseIndicatorHistoryActions
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
)

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
  const isLoading = goals.isLoading || strategies.isLoading || indicators.isLoading || goals.isRefetching || strategies.isRefetching || indicators.isRefetching

  const { weeklyScores, overallGoalScores, overallStrategyScores } = useMemo(() => {
    const goalScores = new Map()
    const strategyScores = new Map()

    const weeklyScores = DEFAULT_WEEKS.map((week) => {
      const filteredGoals = (goals.data || []).filter((g) => g.sequence.toString() === week)

      const goalsScore = filteredGoals.map((goal) => {
        const filteredStrategies = (strategies.data || []).filter(
          (s) => s.sequence.toString() === week && s.strategy.goalId === goal.goalId
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

    return {
      weeklyScores,
      overallGoalScores: goalScores,
      overallStrategyScores: strategyScores,
    }
  }, [strategies, goals])

  return (
    <DashboardContext.Provider
      value={{
        goals: goals.data,
        strategies: strategies.data,
        indicators: indicators.data,
        weeklyScores, 
        overallGoalScores, 
        overallStrategyScores,
        isLoading,
        isLoadingGoals: goals.isLoading || goals.isRefetching,
        isLoadingStrategies: strategies.isLoading || strategies.isRefetching,
        isLoadingIndicators: indicators.isLoading || indicators.isRefetching,
        goalHistoryActions,
        strategyHistoryActions,
        indicatorHistoryActions,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboardContext = (): DashboardContextType => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error(
      'useDashboard must be used within a DashboardProvider'
    )
  }
  return context
}
