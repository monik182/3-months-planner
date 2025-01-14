import { PlanService } from '@/services/plan'
import { Plan } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'plan'

export function usePlanActions(userId: string) {
  const queryClient = useQueryClient()

  const useCreate = () => {
    return useMutation({
      mutationFn: (plan: Plan) => PlanService.create(plan),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY, 'plans'] })
      }
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ planId, updates }: { planId: string, updates: Partial<Plan> }) => PlanService.update(planId, updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY, 'plans'] })
      }
    })
  }

  const useGet = () => {
    return useQuery({
      queryKey: [QUERY_KEY, { userId }],
      queryFn: () => PlanService.getByUserId(userId),
      enabled: !!userId,
    })
  }

  const useGetAll = () => {
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
