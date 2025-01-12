import { z } from 'zod'

export const GoalSchema = z.object({
  id: z.string().cuid(),
  plan_id: z.string().cuid(),
  content: z.string().min(1, 'Content is required'),
  status: z.string().min(1, 'Status is required'),
})

export const PartialGoalSchema = GoalSchema.partial()
export type GoalSchemaType = z.infer<typeof GoalSchema>
export type PartialGoalSchemaType = z.infer<typeof PartialGoalSchema>
