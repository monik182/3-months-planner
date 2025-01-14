import { z } from 'zod'

export const GoalHistorySchema = z.object({
  id: z.string().cuid(),
  goalId: z.string().cuid(),
  planId: z.string().cuid(),
  startDate: z.date(),
  endDate: z.date(),
  sequence: z.number().int(),
})

export const PartialGoalHistorySchema = GoalHistorySchema.partial()
export const GoalHistoryArraySchema = z.array(GoalHistorySchema)
export const PartialGoalHistoryArraySchema = z.array(PartialGoalHistorySchema)
export type GoalHistorySchemaType = z.infer<typeof GoalHistorySchema>
export type PartialGoalHistorySchemaType = z.infer<typeof PartialGoalHistorySchema>
export type GoalHistoryArraySchemaType = z.infer<typeof GoalHistoryArraySchema>
export type PartialGoalHistoryArraySchemaType = z.infer<typeof PartialGoalHistoryArraySchema>
