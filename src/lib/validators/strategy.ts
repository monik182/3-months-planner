import cuid from 'cuid'
import { z } from 'zod'

export const StrategySchema = z.object({
  id: z.string().default(() => cuid()),
  goalId: z.string().cuid(),
  planId: z.string().cuid(),
  frequency: z.number().nonnegative().min(1, 'Frequency is required').max(7),
  content: z.string().default(''),
  weeks: z.array(z.string()),
  status: z.string().default('1'),
  goal: z.object({ connect: z.object({ id: z.string() }) }),
})

export const PartialStrategySchema = StrategySchema.partial()
export const StrategyArraySchema = z.array(StrategySchema)
export const PartialStrategyArraySchema = z.array(PartialStrategySchema)
export type StrategySchemaType = z.infer<typeof StrategySchema>
export type PartialStrategySchemaType = z.infer<typeof PartialStrategySchema>
export type StrategyArraySchemaType = z.infer<typeof StrategyArraySchema>
export type PartialStrategyArraySchemaType = z.infer<typeof PartialStrategyArraySchema>
