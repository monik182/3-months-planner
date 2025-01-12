import { z } from 'zod'

export const PlanSchema = z.object({
  id: z.string().cuid(),
  user_id: z.string().cuid(),
  vision: z.string().min(1, 'Vision is required'),
  milestone: z.string().min(1, 'Milestone is required'),
  completed: z.boolean(),
  start_date: z.string().transform((val) => new Date(val)),
  end_date: z.string().transform((val) => new Date(val)),
  created: z.string().transform((val) => new Date(val)),
  last_update: z.string().transform((val) => new Date(val)),
})

export const PartialPlanSchema = PlanSchema.partial()
export type PlanSchemaType = z.infer<typeof PlanSchema>
export type PartialPlanSchemaType = z.infer<typeof PartialPlanSchema>
