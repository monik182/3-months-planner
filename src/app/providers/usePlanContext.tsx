'use client'
import React, { createContext, useContext, useState } from "react"
import { useUser } from '@auth0/nextjs-auth0/client'
import { UsePlan, usePlan } from '@/app/hooks/usePlan'
import { usePlanActions } from '@/app/hooks/usePlanActions'
import { useGoalActions } from '@/app/hooks/useGoalActions'
import { useStrategyActions } from '@/app/hooks/useStrategyActions'
import { useIndicatorActions } from '@/app/hooks/useIndicatorActions'

type PlanContextType = {
  plan: UsePlan,
  isLoading: boolean
  currentPlan?: Partial<UsePlan['plan']>
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
  const [currentPlan, setCurrentPlan] = useState<Partial<UsePlan['plan']>>()
  const [isLoadingPlan, setIsLoading] = useState(false)
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
        isLoading: isLoading || isLoadingPlan,
        currentPlan,
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
