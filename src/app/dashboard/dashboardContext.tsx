'use client'
import React, { createContext, useContext } from 'react'
import { UseGoalHistoryActions, useGoalHistoryActions } from '@/app/hooks/useGoalHistoryActions'
import { UseStrategyHistoryActions, useStrategyHistoryActions } from '@/app/hooks/useStrategyHistoryActions'
import { UseIndicatorHistoryActions, useIndicatorHistoryActions } from '@/app/hooks/useIndicatorHistoryActions'
import { Center, Spinner } from '@chakra-ui/react'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { GoalHistoryExtended, IndicatorHistoryExtended, StrategyHistoryExtended } from '@/app/types/types'

type DashboardContextType = {
  isLoading: boolean,
  isLoadingGoals: boolean,
  isLoadingStrategies: boolean,
  isLoadingIndicators: boolean,
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

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <DashboardContext.Provider
      value={{
        goals: goals.data,
        strategies: strategies.data,
        indicators: indicators.data,
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
