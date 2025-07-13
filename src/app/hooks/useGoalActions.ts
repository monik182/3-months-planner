import { useMixpanelContext } from '@/app/providers/MixpanelProvider'
import { Status } from '@/app/types/types'
import { toaster } from '@/components/ui/toaster'
import { GoalService } from '@/services/goal'
import { GoalSchemaType, GoalArraySchemaType, PartialGoalSchemaType } from '@/lib/validators/goal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'goals'

export function useGoalActions() {
  const queryClient = useQueryClient()
  const { track } = useMixpanelContext()

  const useCreate = () => {
    return useMutation({
      mutationFn: (goal: GoalSchemaType) => GoalService.create(goal),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('create_goal')
      },
      onError: (error) => {
        toaster.create({
          type: 'error',
          title: 'Error creating the goal',
          description: error.message,
        })
      }
    })
  }

  const useCreateBulk = () => {
    return useMutation({
      mutationFn: (goals: GoalArraySchemaType) => GoalService.createBulk(goals),
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ goalId, updates }: { goalId: string, updates: PartialGoalSchemaType }) => GoalService.update(goalId, updates),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('update_goal', { updated: Object.keys(data) })
      },
    })
  }

  const useGetByPlanId = (planId: string, status?: Status) => {
    return useQuery({
      queryKey: [QUERY_KEY, { planId }],
      queryFn: () => GoalService.getByPlanId(planId, status),
      enabled: !!planId,
    })
  }

  const useGet = (goalId: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { goalId }],
      queryFn: () => GoalService.get(goalId),
      enabled: !!goalId,
    })
  }

  const useDelete = () => {
    return useMutation({
      mutationFn: (goalId: string) => GoalService.deleteItem(goalId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      },
    })
  }

  return {
    useCreate,
    useCreateBulk,
    useUpdate,
    useGetByPlanId,
    useGet,
    useDelete,
  }
}

export type UseGoalActions = ReturnType<typeof useGoalActions>
