import cuid from 'cuid'
import { z } from 'zod'

export const PlanSchema = z.object({
  id: z.string().default(() => cuid()),
  users: z.object({ connect: z.object({ id: z.string() }) }),
  vision: z.string().default(''),
  milestone: z.string().default(''),
  completed: z.boolean().default(false),
  started: z.boolean().default(false),
  startDate: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date({ error: 'Start date is required' })),
  endDate: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date({ error: 'End date is required' })),
  created: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date()),
  lastUpdate: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date()),
})

export const PartialPlanSchema = PlanSchema.partial()
export type PlanSchemaType = z.infer<typeof PlanSchema>
export type PartialPlanSchemaType = z.infer<typeof PartialPlanSchema>
