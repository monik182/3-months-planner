import { toaster } from '@/components/ui/toaster'
import { StrategyService } from '@/services/strategy'
import { Prisma, Strategy } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMixpanelContext } from '@/app/providers/MixpanelProvider'

const QUERY_KEY = 'strategies'

export function useStrategyActions() {
  const queryClient = useQueryClient()
  const { track } = useMixpanelContext()

  const useCreate = () => {
    return useMutation({
      mutationFn: (strategy: Strategy) => StrategyService.create(strategy),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('create_strategy')
      },
      onError: (error) => {
        toaster.create({
          type: 'error',
          title: 'Error creating the strategy',
          description: error.message,
        })
      }
    })
  }

  const useCreateBulk = () => {
    return useMutation({
      mutationFn: (strategies: Strategy[]) => StrategyService.createBulk(strategies),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('create_strategies_bulk')
      },
      onError: (error) => {
        toaster.create({
          type: 'error',
          title: 'Error creating the strategies',
          description: error.message,
        })
      }
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ strategyId, updates }: { strategyId: string, updates: Prisma.StrategyUpdateInput }) => StrategyService.update(strategyId, updates),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('update_strategy', { updated: Object.keys(data) })
      },
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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('delete_strategy')
      },
    })
  }

  return {
    useCreate,
    useCreateBulk,
    useUpdate,
    useGetByPlanId,
    useGetByGoalId,
    useGet,
    useDelete,
  }
}

export type UseStrategyActions = ReturnType<typeof useStrategyActions>
