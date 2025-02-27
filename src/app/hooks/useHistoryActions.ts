import { useMixpanelContext } from '@/app/providers/MixpanelProvider'
import { HistoryService } from '@/services/history'
import { useMutation } from '@tanstack/react-query'

export function useHistoryActions() {
  const { track } = useMixpanelContext()

  const useCreate = () => {
    return useMutation({
      mutationFn: (planId: string) => HistoryService.create(planId),
      onSuccess: () => {
        track('create_plan_history')
      }
    })
  }

  return {
    useCreate
  }
}
