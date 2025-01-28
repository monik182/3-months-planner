import { HistoryService } from '@/services/history'
import { useMutation } from '@tanstack/react-query'

export function useHistoryActions() {
  const useCreate = () => {
    return useMutation({
      mutationFn: (planId: string) => HistoryService.create(planId),
    })
  }

  return {
    useCreate
  }
}
