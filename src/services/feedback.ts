import { Feedback } from '@/app/types/models'
import { FeedbackSchemaType } from '@/lib/validators/feedback'

const create = async (feedback: FeedbackSchemaType): Promise<Feedback> => {

  return fetch(`/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback),
  })
    .then(response => response.json())
}

export const FeedbackService = {
  create,
}
