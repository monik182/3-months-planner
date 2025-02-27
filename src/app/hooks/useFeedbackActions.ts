import { useMixpanelContext } from '@/app/providers/MixpanelProvider'
import { FeedbackService } from '@/services/feedback'
import { Prisma } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

export function useFeedbackActions() {
  const { track } = useMixpanelContext()

  const useCreate = () => {
    return useMutation({
      mutationFn: (feedback: Prisma.FeedbackCreateInput) => FeedbackService.create(feedback),
      onSuccess: (data) => {
        track('send_feedback', { email: data.email })
      }
    })
  }

  return {
    useCreate,
  }
}

export type UseFeedbackActions = ReturnType<typeof useFeedbackActions>
