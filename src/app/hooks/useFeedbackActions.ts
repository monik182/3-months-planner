import { useMixpanelContext } from '@/app/providers/MixpanelProvider'
import { FeedbackService } from '@/services/feedback'
import { LimitService } from '@/services/limit'
import { FeedbackSchemaType } from '@/lib/validators/feedback'
import { useMutation } from '@tanstack/react-query'
import cuid from 'cuid'

export function useFeedbackActions() {
  const { track } = useMixpanelContext()

  const useCreate = () => {
    return useMutation({
      mutationFn: async (feedback: FeedbackSchemaType) => {
        const userId = feedback.userId || feedback.email || cuid()
        const remainingRequests = await LimitService.check(userId)
        if (remainingRequests === false) {
          return { error: 'Daily limit reached! Please, try again tomorrow.', ...feedback }
        }
        console.log(`You have ${remainingRequests} requests left.`)
        return FeedbackService.create(feedback)
      },
      onSuccess: (data) => {
        track('send_feedback', { email: data.email, error: (data as any).error, userId: data.userId })
      }
    })
  }

  return {
    useCreate,
  }
}

export type UseFeedbackActions = ReturnType<typeof useFeedbackActions>
