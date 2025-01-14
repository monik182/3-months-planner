'use client'
import React, { createContext, useContext } from "react"
import { useUser } from '@auth0/nextjs-auth0/client'
import { UsePlan, usePlan } from '@/app/hooks/usePlan'
import { UsePlanActions, usePlanActions } from '@/app/hooks/usePlanActions'
import { UseGoalActions, useGoalActions } from '@/app/hooks/useGoalActions'
import { UseStrategyActions, useStrategyActions } from '@/app/hooks/useStrategyActions'
import { UseIndicatorActions, useIndicatorActions } from '@/app/hooks/useIndicatorActions'
import { UseGoalHistoryActions, useGoalHistoryActions } from '@/app/hooks/useGoalHistoryActions'
import { UseStrategyHistoryActions, useStrategyHistoryActions } from '@/app/hooks/useStrategyHistoryActions'
import { UseIndicatorHistoryActions, useIndicatorHistoryActions } from '@/app/hooks/useIndicatorHistoryActions'

type PlanContextType = {
  plan: UsePlan,
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
  const { user, isLoading } = useUser()
  const plan = usePlan(user?.sub as string)
  const planActions = usePlanActions(user?.sub as string)
  const goalActions = useGoalActions()
  const strategyActions = useStrategyActions()
  const indicatorActions = useIndicatorActions()

  const goalHistoryActions = useGoalHistoryActions()
  const strategyHistoryActions = useStrategyHistoryActions()
  const indicatorHistoryActions = useIndicatorHistoryActions()

  if (isLoading) {
    return <div>Loading....</div>
  }

  if (!user || !plan?.plan) {
    return null
  }

  return (
    <PlanContext.Provider
      value={{
        plan,
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
      "usePlan must be used within a PlanProvider"
    )
  }
  return context
}
