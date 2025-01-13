import { z } from 'zod'

export const IndicatorSchema = z.object({
  id: z.string().cuid(),
  goal_id: z.string().cuid(),
  content: z.string().min(1, 'Content is required'),
  metric: z.string().min(1, 'Metric is required'),
  starting_value: z.number().int(),
  goal_value: z.number().int(),
  status: z.string().min(1, 'Status is required'),
})

export const PartialIndicatorSchema = IndicatorSchema.partial()
export const IndicatorArraySchema = z.array(IndicatorSchema)
export const PartialIndicatorArraySchema = z.array(PartialIndicatorSchema)
export type IndicatorSchemaType = z.infer<typeof IndicatorSchema>
export type PartialIndicatorSchemaType = z.infer<typeof PartialIndicatorSchema>
export type IndicatorArraySchemaType = z.infer<typeof IndicatorArraySchema>
export type PartialIndicatorArraySchemaType = z.infer<typeof PartialIndicatorArraySchema>
