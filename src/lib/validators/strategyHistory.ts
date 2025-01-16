import { z } from 'zod'

export const StrategyHistorySchema = z.object({
  id: z.string().optional(),
  strategyId: z.string().cuid(),
  planId: z.string().cuid(),
  overdue: z.boolean().default(false),
  completed: z.boolean().default(false),
  firstUpdate: z.date().nullable(),
  lastUpdate: z.date().nullable(),
  sequence: z.number().int(),
  frequencies: z.array(z.boolean()).default([]),
})

export const PartialStrategyHistorySchema = StrategyHistorySchema.partial()
export const StrategyHistoryArraySchema = z.array(StrategyHistorySchema)
export const PartialStrategyHistoryArraySchema = z.array(PartialStrategyHistorySchema)
export type StrategyHistorySchemaType = z.infer<typeof StrategyHistorySchema>
export type PartialStrategyHistorySchemaType = z.infer<typeof PartialStrategyHistorySchema>
export type StrategyHistoryArraySchemaType = z.infer<typeof StrategyHistoryArraySchema>
export type PartialStrategyHistoryArraySchemaType = z.infer<typeof PartialStrategyHistoryArraySchema>
