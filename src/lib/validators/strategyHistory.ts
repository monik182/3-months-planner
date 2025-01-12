import { z } from 'zod'

export const StrategyHistorySchema = z.object({
  id: z.string().cuid().optional(),
  strategy_id: z.string().cuid(),
  overdue: z.boolean().optional(),
  completed: z.boolean().optional(),
  first_update: z.date().optional(),
  last_update: z.date().optional(),
})

export const PartialStrategyHistorySchema = StrategyHistorySchema.partial()
export type StrategyHistorySchemaType = z.infer<typeof StrategyHistorySchema>
export type PartialStrategyHistorySchemaType = z.infer<typeof PartialStrategyHistorySchema>
