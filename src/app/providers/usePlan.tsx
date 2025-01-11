'use client'
import React, { createContext, useContext, useEffect } from "react"
import { useUser } from '@auth0/nextjs-auth0/client'
import { UsePlan, usePlan } from '../hooks/usePlan'

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
    saveGoal,
    saveStrategy,
    saveIndicator,
  } = usePlan(user?.sub as string)

  useEffect(() => {
    if (user) {
    }
  }, [user])


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
        saveGoal,
        saveStrategy,
        saveIndicator,
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
