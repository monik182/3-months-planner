import { z } from 'zod'

export const IndicatorSchema = z.object({
  id: z.string().optional(),
  goalId: z.string().cuid(),
  planId: z.string().cuid(),
  content: z.string().default(''),
  metric: z.string().default(''),
  initialValue: z.number().int(),
  goalValue: z.number().int(),
  status: z.string().default('1'),
})

export const PartialIndicatorSchema = IndicatorSchema.partial()
export const IndicatorArraySchema = z.array(IndicatorSchema)
export const PartialIndicatorArraySchema = z.array(PartialIndicatorSchema)
export type IndicatorSchemaType = z.infer<typeof IndicatorSchema>
export type PartialIndicatorSchemaType = z.infer<typeof PartialIndicatorSchema>
export type IndicatorArraySchemaType = z.infer<typeof IndicatorArraySchema>
export type PartialIndicatorArraySchemaType = z.infer<typeof PartialIndicatorArraySchema>
