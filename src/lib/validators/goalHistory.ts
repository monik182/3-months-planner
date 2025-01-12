import { z } from 'zod'

export const GoalHistorySchema = z.object({
  id: z.string().cuid().optional(),
  goal_id: z.string().cuid(),
  start_date: z.date(),
  end_date: z.date(),
})

export const PartialGoalHistorySchema = GoalHistorySchema.partial()
export type GoalHistorySchemaType = z.infer<typeof GoalHistorySchema>
export type PartialGoalHistorySchemaType = z.infer<typeof PartialGoalHistorySchema>
