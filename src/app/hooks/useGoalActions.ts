import { useMixpanelContext } from '@/app/providers/MixpanelProvider'
import { Status } from '@/app/types/types'
import { toaster } from '@/components/ui/toaster'
import { GoalService } from '@/services/goal'
import { Prisma, Goal } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'goals'

export function useGoalActions() {
  const queryClient = useQueryClient()
  const { track } = useMixpanelContext()

  const useCreate = () => {
    return useMutation({
      mutationFn: (goal: Prisma.GoalCreateInput) => GoalService.create(goal),
      onSuccess: (createdGoal) => {
        // Append the new goal to the end of all cached goal lists
        queryClient.setQueriesData<Goal[] | undefined>({ queryKey: [QUERY_KEY] }, (old) => {
          return old ? [...old, createdGoal as unknown as Goal] : old
        })
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
      mutationFn: (goals: Prisma.GoalCreateManyInput[]) => GoalService.createBulk(goals),
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ goalId, updates }: { goalId: string, updates: Prisma.GoalUpdateInput }) => GoalService.update(goalId, updates),
      onSuccess: (data, variables) => {
        // Update goal in place without refetching to keep order intact
        queryClient.setQueriesData<Goal[] | undefined>({ queryKey: [QUERY_KEY] }, (old) => {
          if (!old) return old
          return old.map((g) => g.id === variables.goalId ? { ...g, ...variables.updates } as Goal : g)
        })
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
      onSuccess: (_, goalId) => {
        // Remove goal from cached lists
        queryClient.setQueriesData<Goal[] | undefined>({ queryKey: [QUERY_KEY] }, (old) => {
          return old ? old.filter(g => g.id !== goalId) : old
        })
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('delete_goal')
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
