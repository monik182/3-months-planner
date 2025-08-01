'use client'
import React, { createContext, useContext, useEffect } from 'react'
import { UsePlanActions, usePlanActions } from '@/app/hooks/usePlanActions'
import { UseGoalActions, useGoalActions } from '@/app/hooks/useGoalActions'
import { UseStrategyActions, useStrategyActions } from '@/app/hooks/useStrategyActions'
import { UseIndicatorActions, useIndicatorActions } from '@/app/hooks/useIndicatorActions'
import { UseGoalHistoryActions, useGoalHistoryActions } from '@/app/hooks/useGoalHistoryActions'
import { UseStrategyHistoryActions, useStrategyHistoryActions } from '@/app/hooks/useStrategyHistoryActions'
import { UseIndicatorHistoryActions, useIndicatorHistoryActions } from '@/app/hooks/useIndicatorHistoryActions'
import { Plan, Strategy } from '@prisma/client'
import { Center, Spinner } from '@chakra-ui/react'
import { useAuth } from '@/app/providers/AuthProvider'
import { clearStrategyOrder } from '@/app/util/order'

type PlanContextType = {
  plan: Plan | null | undefined,
  hasPlan: boolean
  hasStartedPlan: boolean
  planActions: UsePlanActions
  goalActions: UseGoalActions
  strategyActions: UseStrategyActions
  indicatorActions: UseIndicatorActions

  strategies: Strategy[]

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
  const { user } = useAuth()
  const planActions = usePlanActions()
  const goalActions = useGoalActions()
  const strategyActions = useStrategyActions()
  const indicatorActions = useIndicatorActions()
  const { data: plan, isLoading: isLoadingPlan } = planActions.useGet(user?.id as string)
  const hasPlan = !!plan
  const hasStartedPlan = !!plan?.started

  const { data: strategies = [], isLoading: strategiesLoading } =
    strategyActions.useGetByPlanId(plan?.id as string)

  useEffect(() => {
    if (!user) {
      clearStrategyOrder()
    }
  }, [user])

  const goalHistoryActions = useGoalHistoryActions()
  const strategyHistoryActions = useStrategyHistoryActions()
  const indicatorHistoryActions = useIndicatorHistoryActions()

  if (isLoadingPlan || strategiesLoading) {
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
        hasStartedPlan,
        planActions,
        goalActions,
        strategyActions,
        indicatorActions,
        strategies,
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
