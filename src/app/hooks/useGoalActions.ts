import { Status } from '@/app/types/types'
import { GoalService } from '@/services/goal'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'goals'

export function useGoalActions() {
  const queryClient = useQueryClient()

  const useCreate = () => {
    return useMutation({
      mutationFn: (goal: Prisma.GoalCreateInput) => GoalService.create(goal),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useCreateBulk = () => {
    return useMutation({
      mutationFn: (goals: Prisma.GoalCreateManyInput[]) => GoalService.createBulk(goals),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ goalId, updates }: { goalId: string, updates: Prisma.GoalUpdateInput }) => GoalService.update(goalId, updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useGetByPlanId = (planId: string, status?: Status) => {
    return useQuery({
      queryKey: [QUERY_KEY, { planId }],
      queryFn: () => GoalService.getByPlanId(planId, status),
      enabled: !!planId,
    })
  }

  const useGet = (goalId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { goalId }],
      queryFn: () => GoalService.get(goalId),
      enabled: !!goalId,
    })
  }

  return {
    useCreate,
    useCreateBulk,
    useUpdate,
    useGetByPlanId,
    useGet,
  }
}

export type UseGoalActions = ReturnType<typeof useGoalActions>
