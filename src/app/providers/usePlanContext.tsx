'use client'
import React, { createContext, useContext } from "react"
import { useUser } from '@auth0/nextjs-auth0/client'
import { UsePlan, usePlan } from '@/app/hooks/usePlan'
import { UsePlanHistory, usePlanHistory } from '@/app/hooks/usePlanHistory'

type PlanContextType = {
  plan: UsePlan,
  planHistory: UsePlanHistory,
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
  const planHistory = usePlanHistory(plan?.plan, plan?.goals, plan?.strategies, plan?.indicators)

  if (isLoading) {
    return <div>Loading....</div>
  }

  if (!plan?.plan || !planHistory) {
    return null
  }

  return (
    <PlanContext.Provider
      value={{
        plan,
        planHistory,
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
