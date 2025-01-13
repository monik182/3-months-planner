import { z } from 'zod'

export const StrategyHistorySchema = z.object({
  id: z.string().cuid(),
  strategy_id: z.string().cuid(),
  overdue: z.boolean(),
  completed: z.boolean(),
  first_update: z.string().transform((val) => new Date(val)).nullable(),
  last_update: z.string().transform((val) => new Date(val)).nullable(),
  sequence: z.number().int(),
})

export const PartialStrategyHistorySchema = StrategyHistorySchema.partial()
export const StrategyHistoryArraySchema = z.array(StrategyHistorySchema)
export const PartialStrategyHistoryArraySchema = z.array(PartialStrategyHistorySchema)
export type StrategyHistorySchemaType = z.infer<typeof StrategyHistorySchema>
export type PartialStrategyHistorySchemaType = z.infer<typeof PartialStrategyHistorySchema>
export type StrategyHistoryArraySchemaType = z.infer<typeof StrategyHistoryArraySchema>
export type PartialStrategyHistoryArraySchemaType = z.infer<typeof PartialStrategyHistoryArraySchema>
