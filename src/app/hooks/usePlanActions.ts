import { PlanService } from '@/services/plan'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMixpanelContext } from '@/app/providers/MixpanelProvider'

const QUERY_KEY = 'plan'

export function usePlanActions() {
  const queryClient = useQueryClient()
  const { track } = useMixpanelContext()

  const useCreate = () => {
    return useMutation({
      mutationFn: (plan: Prisma.PlanCreateInput) => PlanService.create(plan),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('create_plan')
      }
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ planId, updates }: { planId: string, updates: Prisma.PlanUpdateInput }) => PlanService.update(planId, updates),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('update_plan', { updated: Object.keys(data) })
      }
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
