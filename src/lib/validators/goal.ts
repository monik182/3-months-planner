import { z } from 'zod'

export const GoalSchema = z.object({
  id: z.string().optional(),
  content: z.string(),
  status: z.string().default('1'),
  plan: z.object({ connect: z.object({ id: z.string() }) })
})

export const PartialGoalSchema = GoalSchema.partial()
export const GoalArraySchema = z.array(GoalSchema)
export const PartialGoalArraySchema = z.array(PartialGoalSchema)
export type GoalSchemaType = z.infer<typeof GoalSchema>
export type PartialGoalSchemaType = z.infer<typeof PartialGoalSchema>
export type GoalArraySchemaType = z.infer<typeof GoalArraySchema>
export type PartialGoalArraySchemaType = z.infer<typeof PartialGoalArraySchema>
