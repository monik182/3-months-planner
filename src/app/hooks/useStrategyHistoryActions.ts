import { StrategyHistoryService } from '@/services/strategyHistory'
import { StrategyHistory } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'strategy-history'

export function useStrategyHistoryActions() {
  const queryClient = useQueryClient()

  const useCreate = () => {
    return useMutation({
      mutationFn: (strategy: StrategyHistory) => StrategyHistoryService.create(strategy),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ strategyId, updates }: { strategyId: string, updates: Partial<StrategyHistory> }) => StrategyHistoryService.update(strategyId, updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useGetByPlanId = (planId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { planId }],
      queryFn: () => StrategyHistoryService.getByPlanId(planId),
      enabled: !!planId,
    })
  }

  const useGetByGoalId = (goalId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { goalId }],
      queryFn: () => StrategyHistoryService.getByGoalId(goalId),
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
