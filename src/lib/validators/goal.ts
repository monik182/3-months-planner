import { z } from 'zod'

export const GoalSchema = z.object({
  id: z.string().cuid(),
  plan_id: z.string().cuid(),
  content: z.string().min(1, 'Content is required'),
  status: z.string().min(1, 'Status is required'),
})

export const PartialGoalSchema = GoalSchema.partial()
export const GoalSchemaSchema = z.array(GoalSchema)
export const PartialGoalSchemaSchema = z.array(PartialGoalSchema)
export type GoalSchemaType = z.infer<typeof GoalSchema>
export type PartialGoalSchemaType = z.infer<typeof PartialGoalSchema>
export type GoalSchemaSchemaType = z.infer<typeof GoalSchemaSchema>
export type PartialGoalSchemaSchemaType = z.infer<typeof PartialGoalSchemaSchema>
