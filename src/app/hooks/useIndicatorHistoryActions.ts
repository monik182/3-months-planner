import { IndicatorHistoryService } from '@/services/indicatorHistory'
import { IndicatorHistory } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'indicator-history'

export function useIndicatorHistoryActions() {
  const queryClient = useQueryClient()

  const useCreate = () => {
    return useMutation({
      mutationFn: (indicator: IndicatorHistory) => IndicatorHistoryService.create(indicator),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ indicatorId, updates }: { indicatorId: string, updates: Partial<IndicatorHistory> }) => IndicatorHistoryService.update(indicatorId, updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useGetByPlanId = (planId: string, sequence?: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { planId, sequence }],
      queryFn: () => IndicatorHistoryService.getByPlanId(planId, sequence),
      enabled: !!planId,
    })
  }

  const useGetByGoalId = (goalId: string, sequence?: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { goalId, sequence }],
      queryFn: () => IndicatorHistoryService.getByGoalId(goalId, sequence),
      enabled: !!goalId,
    })
  }

  const useGet = (indicatorId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { indicatorId }],
      queryFn: () => IndicatorHistoryService.get(indicatorId),
      enabled: !!indicatorId,
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

export type UseIndicatorHistoryActions = ReturnType<typeof useIndicatorHistoryActions>

export type UseUpdate = ReturnType<ReturnType<typeof useIndicatorHistoryActions>['useUpdate']>
