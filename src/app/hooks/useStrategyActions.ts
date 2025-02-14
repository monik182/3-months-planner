import { StrategyService } from '@/services/strategy'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'

const QUERY_KEY = 'strategies'

export function useStrategyActions() {

  const useCreate = () => {
    return useMutation({
      mutationFn: (strategy: Prisma.StrategyCreateInput) => StrategyService.create(strategy),
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ strategyId, updates }: { strategyId: string, updates: Prisma.StrategyUpdateInput }) => StrategyService.update(strategyId, updates),
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

  const useDelete = () => {
    return useMutation({
      mutationFn: (strategyId: string) => StrategyService.deleteItem(strategyId),
    })
  }

  return {
    useCreate,
    useUpdate,
    useGetByPlanId,
    useGetByGoalId,
    useGet,
    useDelete,
  }
}

export type UseStrategyActions = ReturnType<typeof useStrategyActions>
