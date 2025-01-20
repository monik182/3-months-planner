import { z } from 'zod'

export const GoalSchema = z.object({
  id: z.string().optional(),
  content: z.string(),
  status: z.string().default('1'),
  plan: z.object({ connect: z.object({ id: z.string() }) })
})

export const GoalSchemaMany = z.object({
  id: z.string().optional(),
  content: z.string(),
  planId: z.string(),
  status: z.string().default('1'),
})

export const PartialGoalSchema = GoalSchema.partial()
export const GoalArraySchema = z.array(GoalSchemaMany)
export const PartialGoalArraySchema = z.array(GoalSchemaMany)
export type GoalSchemaType = z.infer<typeof GoalSchema>
export type PartialGoalSchemaType = z.infer<typeof PartialGoalSchema>
export type GoalArraySchemaType = z.infer<typeof GoalArraySchema>
export type PartialGoalArraySchemaType = z.infer<typeof PartialGoalArraySchema>
