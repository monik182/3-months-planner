import { GoalHistoryService } from '@/services/goalHistory'
import { Goal, GoalHistory } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'goal-history'

export function useGoalHistoryActions() {
  const queryClient = useQueryClient()

  const useCreate = () => {
    return useMutation({
      mutationFn: (goal: GoalHistory) => GoalHistoryService.create(goal),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ goalId, updates }: { goalId: string, updates: Partial<Goal> }) => GoalHistoryService.update(goalId, updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useGetByPlanId = (planId: string, sequence?: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { planId, sequence }],
      queryFn: () => GoalHistoryService.getByPlanId(planId, sequence),
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
