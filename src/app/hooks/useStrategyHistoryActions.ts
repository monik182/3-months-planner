import { useMixpanelContext } from '@/app/providers/MixpanelProvider'
import { Status } from '@/app/types/types'
import { StrategyHistoryService } from '@/services/strategyHistory'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'strategy-history'

export function useStrategyHistoryActions() {
  const queryClient = useQueryClient()
  const { track } = useMixpanelContext()

  const useCreate = () => {
    return useMutation({
      mutationFn: (strategy: Prisma.StrategyHistoryCreateInput) => StrategyHistoryService.create(strategy),
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ strategyId, updates }: { strategyId: string, updates: Prisma.StrategyHistoryUpdateInput }) => StrategyHistoryService.update(strategyId, updates),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('update_strategy_history', { updated: Object.keys(data) })
      }
    })
  }

  const useGetByPlanId = (planId: string, sequence?: string, status = Status.ACTIVE) => {
    return useQuery({
      queryKey: [QUERY_KEY, { planId, sequence }],
      queryFn: () => StrategyHistoryService.getByPlanId(planId, sequence, status),
      enabled: !!planId,
    })
  }

  const useGetByGoalId = (goalId: string, sequence?: number, status = Status.ACTIVE) => {
    return useQuery({
      queryKey: [QUERY_KEY, { goalId, sequence }],
      queryFn: () => StrategyHistoryService.getByGoalId(goalId, sequence, status),
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
