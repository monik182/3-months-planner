import { z } from 'zod'

export const StrategyHistorySchema = z.object({
  id: z.string().cuid(),
  strategy_id: z.string().cuid(),
  overdue: z.boolean(),
  completed: z.boolean(),
  first_update: z.string().transform((val) => new Date(val)).nullable(),
  last_update: z.string().transform((val) => new Date(val)).nullable(),
})

export const PartialStrategyHistorySchema = StrategyHistorySchema.partial()
export type StrategyHistorySchemaType = z.infer<typeof StrategyHistorySchema>
export type PartialStrategyHistorySchemaType = z.infer<typeof PartialStrategyHistorySchema>
