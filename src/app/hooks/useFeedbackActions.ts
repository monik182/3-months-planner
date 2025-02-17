import { FeedbackService } from '@/services/feedback'
import { Prisma } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

export function useFeedbackActions() {

  const useCreate = () => {
    return useMutation({
      mutationFn: (plan: Prisma.FeedbackCreateInput) => FeedbackService.create(plan),
    })
  }

  return {
    useCreate,
  }
}

export type UseFeedbackActions = ReturnType<typeof useFeedbackActions>
