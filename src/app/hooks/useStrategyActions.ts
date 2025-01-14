import { StrategyService } from '@/services/strategy'
import { Strategy } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'strategies'

export function useStrategyActions() {
  const queryClient = useQueryClient()

  const useCreate = () => {
    return useMutation({
      mutationFn: (strategy: Strategy) => StrategyService.create(strategy),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ strategyId, updates }: { strategyId: string, updates: Partial<Strategy> }) => StrategyService.update(strategyId, updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useGetByPlanId = (planId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { planId }],
      queryFn: () => StrategyService.getByPlanId(planId),
      enabled: !!planId,
    })
  }

  const useGetByGoalId = (goalId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { goalId }],
      queryFn: () => StrategyService.getByGoalId(goalId),
      enabled: !!goalId,
    })
  }

  const useGet = (strategyId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { strategyId }],
      queryFn: () => StrategyService.get(strategyId),
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

export type UseStrategyActions = ReturnType<typeof useStrategyActions>
