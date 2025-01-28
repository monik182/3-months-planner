import { Status } from '@/app/types/types'
import { GoalService } from '@/services/goal'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'

const QUERY_KEY = 'goals'

export function useGoalActions() {

  const useCreate = () => {
    return useMutation({
      mutationFn: (goal: Prisma.GoalCreateInput) => GoalService.create(goal),
    })
  }

  const useCreateBulk = () => {
    return useMutation({
      mutationFn: (goals: Prisma.GoalCreateManyInput[]) => GoalService.createBulk(goals),
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ goalId, updates }: { goalId: string, updates: Prisma.GoalUpdateInput }) => GoalService.update(goalId, updates),
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
