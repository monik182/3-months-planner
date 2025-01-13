'use client'
import React, { createContext, useContext, useEffect, useState } from "react"
import { useUser } from '@auth0/nextjs-auth0/client'
import { UsePlan, usePlan } from '@/app/hooks/usePlan'
import { UsePlanHistory, usePlanHistory } from '@/app/hooks/usePlanHistory'
import { PlanService } from '@/services/plan'
import { GoalService } from '@/services/goal'
import { StrategyService } from '@/services/strategy'
import { IndicatorService } from '@/services/indicator'
import { Goal } from '@/app/types/Goal'
import { Strategy } from '@/app/types/Strategy'
import { Indicator } from '@/app/types/Indicator'
import { Plan } from '@/app/types/Plan'

type PlanContextType = {
  plan: UsePlan,
  isLoading: boolean
  currentPlan?: Partial<UsePlan['plan']>
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
  const [currentPlan, setCurrentPlan] = useState<Partial<UsePlan['plan']>>()
  const [isLoadingPlan, setIsLoading] = useState(false)
  const plan = usePlan(user?.sub as string)
  const planHistory = usePlanHistory(plan?.plan, plan?.goals, plan?.strategies, plan?.indicators)

  useEffect(() => { 
    async function fetchUserPlan() {
      setIsLoading(true)
      console.log(';inside effe t', user)
      if (!user?.sub) return
      const plan = await PlanService.getByUserId(user.sub)
      console.log('user plan>>>>>', plan)
      if (plan) {
        const goals = await GoalService.getByPlanId(plan.id)
        // TODO: refactor this to get by plan id
        // const strategies = await StrategyService.getByPlanId(plan.id)
        // const indicators = await IndicatorService.getByPlanId(plan.id)
        const currentPlan = {
          plan: new Plan(user.sub).createFromPrisma(plan),
          goals: goals.map(new Goal(plan.id).createFromPrisma) || [],
          // strategies: strategies.map(new Strategy(plan.id).createFromPrisma) || [],
          // indicators: indicators.map(new Indicator(plan.id).createFromPrisma) || [],
        } as Partial<UsePlan['plan']> // TODO: review this later
        setCurrentPlan(currentPlan)
      }
      setIsLoading(false)
    }
    fetchUserPlan()
  }, [user])


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
        isLoading: isLoading || isLoadingPlan,
        currentPlan,
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
