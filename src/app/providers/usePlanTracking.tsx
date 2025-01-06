'use client'
import React, { createContext, useContext, useState, useCallback } from "react"
import { PlanTracking } from '@/types'

interface PlanTrackingContextType {
  planTracking: PlanTracking
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

const PlanTrackingContext = createContext<PlanTrackingContextType | undefined>(
  undefined
)

interface PlanTrackingProviderProps {
  initialPlan: PlanTracking
  children: React.ReactNode
}

export const PlanTrackingProvider = ({
  children,
  initialPlan,
}: PlanTrackingProviderProps) => {
  const [planTracking, setPlanTracking] = useState<PlanTracking>(initialPlan)

  const updateIndicatorValue = useCallback(
    (weekId: string, indicatorId: string, newValue: number) => {
      setPlanTracking((prevPlan) => {
        const updatedWeeks = prevPlan.weeks.map((week) => {
          if (week.id !== weekId) return week

          const updatedGoals = week.goals.map((goal) => {
            const updatedIndicators = goal.indicators.map((indicator) => {
              if (indicator.id === indicatorId) {
                return { ...indicator, value: newValue }
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
      setPlanTracking((prevPlan) => {
        const updatedWeeks = prevPlan.weeks.map((week) => {
          if (week.id !== weekId) return week

          const updatedGoals = week.goals.map((goal) => {
            const updatedStrategies = goal.strategies.map((strategy) => {
              if (strategy.id === strategyId) {
                return { ...strategy, checked, lastUpdated: new Date().toISOString() }
              }
              return strategy
            })
            return { ...goal, strategies: updatedStrategies }
          })

          return { ...week, goals: updatedGoals }
        })

        return { ...prevPlan, weeks: updatedWeeks }
      })
    },
    []
  )

  return (
    <PlanTrackingContext.Provider
      value={{
        planTracking,
        updateIndicatorValue,
        updateStrategyChecked,
      }}
    >
      {children}
    </PlanTrackingContext.Provider>
  )
}

export const usePlanTracking = (): PlanTrackingContextType => {
  const context = useContext(PlanTrackingContext)
  if (!context) {
    throw new Error(
      "usePlanTracking must be used within a PlanTrackingProvider"
    )
  }
  return context
}
