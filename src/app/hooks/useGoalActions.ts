import { GoalService } from '@/services/goal'
import { Goal } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'goals'

export function useGoalActions() {
  const queryClient = useQueryClient()
  const useCreate = () => {
    return useMutation({
      mutationFn: (goal: Goal) => GoalService.create(goal),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ goalId, updates }: { goalId: string, updates: Partial<Goal> }) => GoalService.update(goalId, updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useGetByPlanId = (planId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { planId }],
      queryFn: () => GoalService.getByPlanId(planId)
    })
  }

  const useGet = (goalId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { goalId }],
      queryFn: () => GoalService.get(goalId)
    })
  }

  return {
    useCreate,
    useUpdate,
    useGetByPlanId,
    useGet,
  }
}
