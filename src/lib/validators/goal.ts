import { z } from 'zod'

export const GoalSchema = z.object({
  id: z.string().cuid(),
  planId: z.string().cuid(),
  content: z.string().min(1, 'Content is required'),
  status: z.string().min(1, 'Status is required'),
})

export const PartialGoalSchema = GoalSchema.partial()
export const GoalArraySchema = z.array(GoalSchema)
export const PartialGoalArraySchema = z.array(PartialGoalSchema)
export type GoalSchemaType = z.infer<typeof GoalSchema>
export type PartialGoalSchemaType = z.infer<typeof PartialGoalSchema>
export type GoalArraySchemaType = z.infer<typeof GoalArraySchema>
export type PartialGoalArraySchemaType = z.infer<typeof PartialGoalArraySchema>
