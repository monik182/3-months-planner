import { z } from 'zod'

export const GoalHistorySchema = z.object({
  id: z.string().cuid(),
  goal_id: z.string().cuid(),
  start_date: z.string().transform((val) => new Date(val)),
  end_date: z.string().transform((val) => new Date(val)),
  sequence: z.number().int(),
})

export const PartialGoalHistorySchema = GoalHistorySchema.partial()
export const GoalHistorySchemaSchema = z.array(GoalHistorySchema)
export const PartialGoalHistorySchemaSchema = z.array(PartialGoalHistorySchema)
export type GoalHistorySchemaType = z.infer<typeof GoalHistorySchema>
export type PartialGoalHistorySchemaType = z.infer<typeof PartialGoalHistorySchema>
export type GoalHistorySchemaSchemaType = z.infer<typeof GoalHistorySchemaSchema>
export type PartialGoalHistorySchemaSchemaType = z.infer<typeof PartialGoalHistorySchemaSchema>
