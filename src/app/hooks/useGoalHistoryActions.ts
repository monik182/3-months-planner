import { Status } from '@/app/types/types'
import { GoalHistoryService } from '@/services/goalHistory'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'

const QUERY_KEY = 'goal-history'

export function useGoalHistoryActions() {

  const useCreate = () => {
    return useMutation({
      mutationFn: (goal: Prisma.GoalHistoryCreateInput) => GoalHistoryService.create(goal),
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ goalId, updates }: { goalId: string, updates: Prisma.GoalHistoryUpdateInput }) => GoalHistoryService.update(goalId, updates),
    })
  }

  const useGetByPlanId = (planId: string, sequence?: string, status = Status.ACTIVE) => {
    return useQuery({
      queryKey: [QUERY_KEY, { planId, sequence }],
      queryFn: () => GoalHistoryService.getByPlanId(planId, sequence, status),
      enabled: !!planId,
    })
  }

  const useGet = (goalId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { goalId }],
      queryFn: () => GoalHistoryService.get(goalId),
      enabled: !!goalId,
    })
  }

  return {
    useCreate,
    useUpdate,
    useGetByPlanId,
    useGet,
  }
}

export type UseGoalHistoryActions = ReturnType<typeof useGoalHistoryActions>
