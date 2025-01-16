import { StrategyHistoryService } from '@/services/strategyHistory'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'strategy-history'

export function useStrategyHistoryActions() {
  const queryClient = useQueryClient()

  const useCreate = () => {
    return useMutation({
      mutationFn: (strategy: Prisma.StrategyHistoryCreateInput) => StrategyHistoryService.create(strategy),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ strategyId, updates }: { strategyId: string, updates: Prisma.StrategyHistoryUpdateInput }) => StrategyHistoryService.update(strategyId, updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useGetByPlanId = (planId: string, sequence?: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { planId, sequence }],
      queryFn: () => StrategyHistoryService.getByPlanId(planId, sequence),
      enabled: !!planId,
    })
  }

  const useGetByGoalId = (goalId: string, sequence?: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { goalId, sequence }],
      queryFn: () => StrategyHistoryService.getByGoalId(goalId, sequence),
      enabled: !!goalId,
    })
  }

  const useGet = (strategyId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { strategyId }],
      queryFn: () => StrategyHistoryService.get(strategyId),
      enabled: !!strategyId,
    })
  }

  return {
    useCreate,
    useUpdate,
    useGetByPlanId,
    useGetByGoalId,
    useGet,
  }
}

export type UseStrategyHistoryActions = ReturnType<typeof useStrategyHistoryActions>
export type UseUpdate = ReturnType<ReturnType<typeof useStrategyHistoryActions>['useUpdate']>
