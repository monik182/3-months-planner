'use client'
import React, { createContext, useContext } from "react"
import { useUser } from '@auth0/nextjs-auth0/client'
import { UsePlan, usePlan } from '@/app/hooks/usePlan'

type PlanContextType = {} & UsePlan

const PlanContext = createContext<PlanContextType | undefined>(
  undefined
)

interface PlanTrackingProviderProps {
  children: React.ReactNode
}

export const PlanProvider = ({ children }: PlanTrackingProviderProps) => {
  const { user, isLoading } = useUser()

  const {
    plan,
    goals,
    strategies,
    indicators,
    createGoal,
    createStrategy,
    createIndicator,
    updatePlan,
    updateGoal,
    updateStrategy,
    updateIndicator,
    removeGoal,
    removeStrategy,
    removeIndicator,
  } = usePlan(user?.sub as string)

  if (isLoading) {
    return <div>Loading....</div>
  }

  if (!plan) {
    return null
  }

  return (
    <PlanContext.Provider
      value={{
        plan,
        goals,
        strategies,
        indicators,
        createGoal,
        createStrategy,
        createIndicator,
        updatePlan,
        updateGoal,
        updateStrategy,
        updateIndicator,
        removeGoal,
        removeStrategy,
        removeIndicator,
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
