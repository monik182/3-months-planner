'use client'
import React, { createContext, useContext } from "react"
import { useUser } from '@auth0/nextjs-auth0/client'
import { UsePlanActions, usePlanActions } from '@/app/hooks/usePlanActions'
import { UseGoalActions, useGoalActions } from '@/app/hooks/useGoalActions'
import { UseStrategyActions, useStrategyActions } from '@/app/hooks/useStrategyActions'
import { UseIndicatorActions, useIndicatorActions } from '@/app/hooks/useIndicatorActions'
import { UseGoalHistoryActions, useGoalHistoryActions } from '@/app/hooks/useGoalHistoryActions'
import { UseStrategyHistoryActions, useStrategyHistoryActions } from '@/app/hooks/useStrategyHistoryActions'
import { UseIndicatorHistoryActions, useIndicatorHistoryActions } from '@/app/hooks/useIndicatorHistoryActions'
import { Plan } from '@prisma/client'
import { Center, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

type PlanContextType = {
  plan: Plan | undefined,
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
  const router = useRouter()
  const { user, isLoading } = useUser()
  const planActions = usePlanActions()
  const goalActions = useGoalActions()
  const strategyActions = useStrategyActions()
  const indicatorActions = useIndicatorActions()
  const { data: plan, isLoading: isLoadingPlan } = planActions.useGet(user?.sub as string)

  const goalHistoryActions = useGoalHistoryActions()
  const strategyHistoryActions = useStrategyHistoryActions()
  const indicatorHistoryActions = useIndicatorHistoryActions()

  if (isLoading || isLoadingPlan) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  if (!user) {
    router.replace('/')
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
