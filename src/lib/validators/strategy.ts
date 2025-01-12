import { z } from 'zod'

export const StrategySchema = z.object({
  id: z.string().cuid(),
  goal_id: z.string().cuid(),
  content: z.string().min(1, 'Content is required'),
  weeks: z.string().min(1, 'Weeks is required'),
  status: z.string().min(1, 'Status is required'),
})

export const PartialStrategySchema = StrategySchema.partial()
export type StrategySchemaType = z.infer<typeof StrategySchema>
export type PartialStrategySchemaType = z.infer<typeof PartialStrategySchema>
