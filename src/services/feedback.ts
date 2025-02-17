import { Prisma, Feedback } from '@prisma/client'

const create = async (feedback: Prisma.FeedbackCreateInput): Promise<Feedback> => {

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
