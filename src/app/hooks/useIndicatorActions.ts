import { useMixpanelContext } from '@/app/providers/MixpanelProvider'
import { toaster } from '@/components/ui/toaster'
import { IndicatorService } from '@/services/indicator'
import { Indicator, Prisma } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'indicators'

export function useIndicatorActions() {
  const queryClient = useQueryClient()
  const { track } = useMixpanelContext()

  const useCreate = () => {
    return useMutation({
      mutationFn: (indicator: Indicator) => IndicatorService.create(indicator),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('create_indicator')
      },
      onError: (error) => {
        toaster.create({
          type: 'error',
          title: 'Error creating the indicator',
          description: error.message,
        })
      }
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ indicatorId, updates }: { indicatorId: string, updates: Prisma.IndicatorUpdateInput }) => IndicatorService.update(indicatorId, updates),
      onSuccess: (data) => {
        track('update_indicator', { updated: Object.keys(data) })
      }
    })
  }

  const useGetByPlanId = (planId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { planId }],
      queryFn: () => IndicatorService.getByPlanId(planId),
      enabled: !!planId,
    })
  }

  const useGetByGoalId = (goalId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { goalId }],
      queryFn: () => IndicatorService.getByGoalId(goalId),
      enabled: !!goalId,
    })
  }

  const useGet = (indicatorId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { indicatorId }],
      queryFn: () => IndicatorService.get(indicatorId),
      enabled: !!indicatorId,
    })
  }

  const useDelete = () => {
    return useMutation({
      mutationFn: (indicatorId: string) => IndicatorService.deleteItem(indicatorId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('delete_indicator')
      },
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

export type UseIndicatorActions = ReturnType<typeof useIndicatorActions>
