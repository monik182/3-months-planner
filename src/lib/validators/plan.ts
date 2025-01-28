import { z } from 'zod'

export const PlanSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  vision: z.string().default(''),
  milestone: z.string().default(''),
  completed: z.boolean().default(false),
  started: z.boolean().default(false),
  startDate: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date({ required_error: 'Start date is required' })),
  endDate: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date({ required_error: 'End date is required' })),
  created: z.date().default(new Date()),
  lastUpdate: z.date().default(new Date()),
})

export const PartialPlanSchema = PlanSchema.partial()
export type PlanSchemaType = z.infer<typeof PlanSchema>
export type PartialPlanSchemaType = z.infer<typeof PartialPlanSchema>
