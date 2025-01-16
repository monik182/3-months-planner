import { z } from 'zod'

export const PlanSchema = z.object({
  userId: z.string().nonempty('User ID is required'),
  startDate: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date({ required_error: 'Start date is required' })),
  endDate: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date({ required_error: 'End date is required' })),
})

export const PartialPlanSchema = PlanSchema.partial()
export type PlanSchemaType = z.infer<typeof PlanSchema>
export type PartialPlanSchemaType = z.infer<typeof PartialPlanSchema>
