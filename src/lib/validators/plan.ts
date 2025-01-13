import { z } from 'zod'

export const PlanSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  vision: z.string().min(1, 'Vision is required'),
  milestone: z.string().min(1, 'Milestone is required'),
  completed: z.boolean(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  created: z.string().datetime(),
  lastUpdate: z.string().datetime(),
})

export const PartialPlanSchema = PlanSchema.partial()
export type PlanSchemaType = z.infer<typeof PlanSchema>
export type PartialPlanSchemaType = z.infer<typeof PartialPlanSchema>
