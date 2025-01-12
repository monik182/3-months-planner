import { z } from 'zod'

export const PlanSchema = z.object({
  id: z.string().cuid().optional(),
  user_id: z.string().cuid(),
  vision: z.string().min(1, 'Vision is required'),
  milestone: z.string().min(1, 'Milestone is required'),
  completed: z.boolean().optional(),
  start_date: z.date(),
  end_date: z.date(),
  created: z.date().optional(),
  last_update: z.date().optional(),
})

export const PartialPlanSchema = PlanSchema.partial()
export type PlanSchemaType = z.infer<typeof PlanSchema>
export type PartialPlanSchemaType = z.infer<typeof PartialPlanSchema>
