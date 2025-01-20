import { z } from 'zod'

export const StrategySchema = z.object({
  id: z.string().optional(),
  goalId: z.string().cuid(),
  planId: z.string().cuid(),
  frequency: z.number().nonnegative().min(1, 'Frequency is required').max(7),
  content: z.string().default(''),
  weeks: z.array(z.string()),
  status: z.string().default('1'),
})

export const PartialStrategySchema = StrategySchema.partial()
export const StrategyArraySchema = z.array(StrategySchema)
export const PartialStrategyArraySchema = z.array(PartialStrategySchema)
export type StrategySchemaType = z.infer<typeof StrategySchema>
export type PartialStrategySchemaType = z.infer<typeof PartialStrategySchema>
export type StrategyArraySchemaType = z.infer<typeof StrategyArraySchema>
export type PartialStrategyArraySchemaType = z.infer<typeof PartialStrategyArraySchema>
