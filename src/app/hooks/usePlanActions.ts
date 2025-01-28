import { PlanService } from '@/services/plan'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'

const QUERY_KEY = 'plan'

export function usePlanActions() {

  const useCreate = () => {
    return useMutation({
      mutationFn: (plan: Prisma.PlanCreateInput) => PlanService.create(plan),
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ planId, updates }: { planId: string, updates: Prisma.PlanUpdateInput }) => PlanService.update(planId, updates),
    })
  }

  const useGet = (userId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { userId }],
      queryFn: () => PlanService.getByUserId(userId),
      enabled: !!userId,
    })
  }

  const useGetAll = (userId: string) => {
    return useQuery({
      queryKey: ['plans', { userId }],
      queryFn: () => PlanService.getAll(userId),
      enabled: !!userId,
    })
  }

  return {
    useCreate,
    useUpdate,
    useGet,
    useGetAll,
  }
}

export type UsePlanActions = ReturnType<typeof usePlanActions>
