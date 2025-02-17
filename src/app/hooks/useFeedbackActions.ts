import { FeedbackService } from '@/services/feedback'
import { Prisma } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

export function useFeedbackActions() {

  const useCreate = () => {
    return useMutation({
      mutationFn: (feedback: Prisma.FeedbackCreateInput) => FeedbackService.create(feedback),
    })
  }

  return {
    useCreate,
  }
}

export type UseFeedbackActions = ReturnType<typeof useFeedbackActions>
