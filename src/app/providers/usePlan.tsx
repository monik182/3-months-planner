'use client'
import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { Plan } from '@/types'
import { calculateGoalScore, calculateWeekScore, isStrategyOverdue } from '../util'
import { createPlan } from '../factories'
import { useUser } from '@auth0/nextjs-auth0/client'

interface PlanContextType {
  plan: Plan
  updateIndicatorValue: (
    weekId: string,
    indicatorId: string,
    newValue: number
  ) => void
  updateStrategyChecked: (
    weekId: string,
    strategyId: string,
    checked: boolean
  ) => void
}

const PlanContext = createContext<PlanContextType | undefined>(
  undefined
)

interface PlanTrackingProviderProps {
  children: React.ReactNode
}

export const PlanProvider = ({ children }: PlanTrackingProviderProps) => {
  const { user, isLoading } = useUser()
  // TODO: get user plan from API, if there are no plans, create a new one
  const [plan, setPlan] = useState<Plan>()

  useEffect(() => {
    if (user) {
      setPlan(createPlan(user.id as string))
    }
  }, [user])

  if (!plan) {
    return null
  }

  const updateIndicatorValue = useCallback(
    (weekId: string, indicatorId: string, newValue: number) => {      
      setPlan((prevPlan) => {
        if (!prevPlan) return prevPlan
        const updatedWeeks = prevPlan.weeks.map((week, index) => {
          if (week.id !== weekId) return week

          const updatedGoals = week.goals.map((goal) => {
            const updatedIndicators = goal.indicators.map((indicator) => {
              if (indicator.id === indicatorId) {
                const updatedIndicator = { ...indicator, value: newValue }
                return updatedIndicator
              }
              return indicator
            })
            return { ...goal, indicators: updatedIndicators }
          })

          return { ...week, goals: updatedGoals }
        })

        return { ...prevPlan, weeks: updatedWeeks }
      })
    },
    []
  )

  const updateStrategyChecked = useCallback(
    (weekId: string, strategyId: string, checked: boolean) => {
      setPlan((prevPlan) => {
        if (!prevPlan) return prevPlan

        const updatedWeeks = prevPlan.weeks.map((week) => {
          if (week.id !== weekId) return week

          const updatedGoals = week.goals.map((goal) => {
            const updatedStrategies = goal.strategies.map((strategy) => {
              if (strategy.id === strategyId) {
                const updatedStrategy = {
                  ...strategy,
                  checked,
                  firstUpdated: !strategy.firstUpdated ? new Date().toISOString() : strategy.firstUpdated,
                  lastUpdated: new Date().toISOString(),
                }
                updatedStrategy.overdue = updatedStrategy.overdue ? updatedStrategy.overdue : isStrategyOverdue(updatedStrategy, week.endDate!)
                return updatedStrategy
              }
              return strategy
            })

            const updatedGoal = {
              ...goal,
              strategies: updatedStrategies,
            }
            updatedGoal.score = calculateGoalScore(updatedGoal)
            return updatedGoal
          })

          return {
            ...week,
            goals: updatedGoals,
            score: calculateWeekScore(updatedGoals),
          }
        })

        return { ...prevPlan, weeks: updatedWeeks }
      })
    },
    []
  )

  return (
    <PlanContext.Provider
      value={{
        plan,
        updateIndicatorValue,
        updateStrategyChecked,
      }}
    >
      {children}
    </PlanContext.Provider>
  )
}

export const usePlan = (): PlanContextType => {
  const context = useContext(PlanContext)
  if (!context) {
    throw new Error(
      "usePlan must be used within a PlanProvider"
    )
  }
  return context
}
