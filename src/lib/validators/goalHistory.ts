import cuid from 'cuid'
import { z } from 'zod'

export const GoalHistorySchema = z.object({
  id: z.string().default(() => cuid()),
  goalId: z.string().cuid(),
  planId: z.string().cuid(),
  sequence: z.number().int(),
  goal: z.object({ connect: z.object({ id: z.string() }) })
})

export const PartialGoalHistorySchema = GoalHistorySchema.partial()
export const GoalHistoryArraySchema = z.array(GoalHistorySchema)
export const PartialGoalHistoryArraySchema = z.array(PartialGoalHistorySchema)
export type GoalHistorySchemaType = z.infer<typeof GoalHistorySchema>
export type PartialGoalHistorySchemaType = z.infer<typeof PartialGoalHistorySchema>
export type GoalHistoryArraySchemaType = z.infer<typeof GoalHistoryArraySchema>
export type PartialGoalHistoryArraySchemaType = z.infer<typeof PartialGoalHistoryArraySchema>
