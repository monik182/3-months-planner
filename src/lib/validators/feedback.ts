import cuid from 'cuid'
import { z } from 'zod'

export const FeedbackSchema = z.object({
  id: z.string().default(() => cuid()),
  useId: z.string().optional(),
  feedback: z.string(),
  email: z.email().optional(),
  createdAt: z.date().default(() => new Date()),
})

export const PartialFeedbackSchema = FeedbackSchema.partial()
export const FeedbackArraySchema = z.array(FeedbackSchema)
export const PartialFeedbackArraySchema = z.array(PartialFeedbackSchema)
export type FeedbackSchemaType = z.infer<typeof FeedbackSchema>
export type PartialFeedbackSchemaType = z.infer<typeof PartialFeedbackSchema>
export type FeedbackArraySchemaType = z.infer<typeof FeedbackArraySchema>
export type PartialFeedbackArraySchemaType = z.infer<typeof PartialFeedbackArraySchema>
