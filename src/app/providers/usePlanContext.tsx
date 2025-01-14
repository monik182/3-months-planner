'use client'
import React, { createContext, useContext } from "react"
import { useUser } from '@auth0/nextjs-auth0/client'
import { UsePlan, usePlan } from '@/app/hooks/usePlan'
import { usePlanActions } from '@/app/hooks/usePlanActions'
import { useGoalActions } from '@/app/hooks/useGoalActions'
import { useStrategyActions } from '@/app/hooks/useStrategyActions'
import { useIndicatorActions } from '@/app/hooks/useIndicatorActions'

type PlanContextType = {
  plan: UsePlan,
  isLoading: boolean,
  planActions: any // FIXME: to 
  goalActions: any // FIXME: to 
  strategyActions: any // FIXME: to 
  indicatorActions: any // FIXME: to 
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
