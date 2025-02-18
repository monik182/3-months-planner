'use client'
import React, { createContext, useContext } from 'react'
import { UsePlanActions, usePlanActions } from '@/app/hooks/usePlanActions'
import { UseGoalActions, useGoalActions } from '@/app/hooks/useGoalActions'
import { UseStrategyActions, useStrategyActions } from '@/app/hooks/useStrategyActions'
import { UseIndicatorActions, useIndicatorActions } from '@/app/hooks/useIndicatorActions'
import { UseGoalHistoryActions, useGoalHistoryActions } from '@/app/hooks/useGoalHistoryActions'
import { UseStrategyHistoryActions, useStrategyHistoryActions } from '@/app/hooks/useStrategyHistoryActions'
import { UseIndicatorHistoryActions, useIndicatorHistoryActions } from '@/app/hooks/useIndicatorHistoryActions'
import { Plan } from '@prisma/client'
import { Center, Spinner } from '@chakra-ui/react'
import { useAccountContext } from '@/app/providers/useAccountContext'

type PlanContextType = {
  plan: Plan | null | undefined,
  hasPlan: boolean
  isLoading: boolean,
  planActions: UsePlanActions
  goalActions: UseGoalActions
  strategyActions: UseStrategyActions
  indicatorActions: UseIndicatorActions

  goalHistoryActions: UseGoalHistoryActions
  strategyHistoryActions: UseStrategyHistoryActions
  indicatorHistoryActions: UseIndicatorHistoryActions
}

const PlanContext = createContext<PlanContextType | undefined>(
  undefined
)

interface PlanTrackingProviderProps {
  children: React.ReactNode
}

export const PlanProvider = ({ children }: PlanTrackingProviderProps) => {
  const { user, isLoading } = useAccountContext()
  const planActions = usePlanActions()
  const goalActions = useGoalActions()
  const strategyActions = useStrategyActions()
  const indicatorActions = useIndicatorActions()
  const { data: plan, isLoading: isLoadingPlan } = planActions.useGet(user?.id as string)
  const hasPlan = !!plan?.started

  const goalHistoryActions = useGoalHistoryActions()
  const strategyHistoryActions = useStrategyHistoryActions()
  const indicatorHistoryActions = useIndicatorHistoryActions()

  if (isLoading || isLoadingPlan) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <PlanContext.Provider
      value={{
        plan,
        hasPlan,
        isLoading,
        planActions,
        goalActions,
        strategyActions,
        indicatorActions,
        goalHistoryActions,
        strategyHistoryActions,
        indicatorHistoryActions,
      }}
    >
      {children}
    </PlanContext.Provider>
  )
}

export const usePlanContext = (): PlanContextType => {
  const context = useContext(PlanContext)
  if (!context) {
    throw new Error(
      'usePlan must be used within a PlanProvider'
    )
  }
  return context
}
