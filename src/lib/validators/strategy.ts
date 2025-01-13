import { z } from 'zod'

export const StrategySchema = z.object({
  id: z.string().cuid(),
  goalId: z.string().cuid(),
  planId: z.string().cuid(),
  content: z.string().min(1, 'Content is required'),
  weeks: z.string().min(1, 'Weeks is required'),
  status: z.string().min(1, 'Status is required'),
})

export const PartialStrategySchema = StrategySchema.partial()
export const StrategyArraySchema = z.array(StrategySchema)
export const PartialStrategyArraySchema = z.array(PartialStrategySchema)
export type StrategySchemaType = z.infer<typeof StrategySchema>
export type PartialStrategySchemaType = z.infer<typeof PartialStrategySchema>
export type StrategyArraySchemaType = z.infer<typeof StrategyArraySchema>
export type PartialStrategyArraySchemaType = z.infer<typeof PartialStrategyArraySchema>
