'use client'
import React, { createContext, useContext, useEffect, useMemo } from 'react'
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
import {
  getStrategyOrder,
  setStrategyOrder,
  clearStrategyOrder,
} from '@/app/util/order'

type PlanContextType = {
  plan: Plan | null,
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
  const orderedStrategies = useMemo(() => {
    if (!plan?.id) return strategies
    const storedOrder = getStrategyOrder(plan.id) || []
    const orderMap = new Map(storedOrder.map((id, idx) => [id, idx]))
    const sorted = [...strategies].sort((a, b) => {
      const ia = orderMap.get(a.id)
      const ib = orderMap.get(b.id)
      if (ia !== undefined && ib !== undefined) return ia - ib
      if (ia !== undefined) return -1
      if (ib !== undefined) return 1
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
    setStrategyOrder(plan.id, sorted.map((s) => s.id))
    return sorted
  }, [plan?.id, strategies])

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

        strategies: orderedStrategies,
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
