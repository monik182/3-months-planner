import { useMixpanelContext } from '@/app/providers/MixpanelProvider'
import { IndicatorHistoryService } from '@/services/indicatorHistory'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'indicator-history'

export function useIndicatorHistoryActions() {
  const queryClient = useQueryClient()
  const { track } = useMixpanelContext()

  const useCreate = () => {
    return useMutation({
      mutationFn: (indicator: Prisma.IndicatorHistoryCreateInput) => IndicatorHistoryService.create(indicator),
    })
  }

  const useCreateBulk = () => {
    return useMutation({
      mutationFn: (indicators: Prisma.IndicatorHistoryCreateManyInput[]) => IndicatorHistoryService.createBulk(indicators),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('create_indicator_history')
      },
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ indicatorId, updates }: { indicatorId: string, updates: Prisma.IndicatorHistoryUpdateInput }) => IndicatorHistoryService.update(indicatorId, updates),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('update_indicator_history', { updated: Object.keys(data) })
      }
    })
  }

  const useGetByPlanId = (planId: string, sequence?: number) => {
    return useQuery({
      queryKey: [QUERY_KEY, { planId, sequence }],
      queryFn: () => IndicatorHistoryService.getByPlanId(planId, sequence),
      enabled: !!planId,
    })
  }

  const useGetByGoalId = (goalId: string, sequence?: number) => {
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
    useCreateBulk,
  }
}

export type UseIndicatorHistoryActions = ReturnType<typeof useIndicatorHistoryActions>

export type UseUpdate = ReturnType<ReturnType<typeof useIndicatorHistoryActions>['useUpdate']>
