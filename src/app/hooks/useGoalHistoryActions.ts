import { useMixpanelContext } from '@/app/providers/MixpanelProvider'
import { Status } from '@/app/types/types'
import { GoalHistoryService } from '@/services/goalHistory'
import { GoalHistorySchemaType, GoalHistoryNoGoalArraySchemaType, PartialGoalHistorySchemaType } from '@/lib/validators/goalHistory'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'goal-history'

export function useGoalHistoryActions() {
  const queryClient = useQueryClient()
  const { track } = useMixpanelContext()

  const useCreate = () => {
    return useMutation({
      mutationFn: (goal: GoalHistorySchemaType) => GoalHistoryService.create(goal),
    })
  }

  const useCreateBulk = () => {
    return useMutation({
      mutationFn: (goals: GoalHistoryNoGoalArraySchemaType) => GoalHistoryService.createBulk(goals),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('create_goal_history')
      },
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ goalId, updates }: { goalId: string, updates: PartialGoalHistorySchemaType }) => GoalHistoryService.update(goalId, updates),
    })
  }

  const useGetByPlanId = (planId: string, sequence?: number, status = Status.ACTIVE) => {
    return useQuery({
      queryKey: [QUERY_KEY, { planId, sequence }],
      queryFn: () => GoalHistoryService.getByPlanId(planId, sequence, status),
      enabled: !!planId,
    })
  }

  const useGet = (goalId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { goalId }],
      queryFn: () => GoalHistoryService.get(goalId),
      enabled: !!goalId,
    })
  }

  return {
    useCreate,
    useUpdate,
    useGetByPlanId,
    useGet,
    useCreateBulk,
  }
}

export type UseGoalHistoryActions = ReturnType<typeof useGoalHistoryActions>
