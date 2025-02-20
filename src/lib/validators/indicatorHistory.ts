import cuid from 'cuid'
import { z } from 'zod'

export const IndicatorHistorySchema = z.object({
  id: z.string().default(() => cuid()),
  indicatorId: z.string().cuid(),
  planId: z.string().cuid(),
  value: z.number().int(),
  sequence: z.number().int(),
  indicator: z.object({ connect: z.object({ id: z.string() }) })
})

export const IndicatorHistoryNoIndicatorSchema = z.object({
  id: z.string().default(() => cuid()),
  indicatorId: z.string().cuid(),
  planId: z.string().cuid(),
  value: z.number().int(),
  sequence: z.number().int(),
})

export const PartialIndicatorHistorySchema = IndicatorHistorySchema.partial()
export const IndicatorHistoryArraySchema = z.array(IndicatorHistorySchema)
export const IndicatorHistoryNoIndicatorArraySchema = z.array(IndicatorHistoryNoIndicatorSchema)
export const PartialIndicatorHistoryArraySchema = z.array(PartialIndicatorHistorySchema)
export type IndicatorHistorySchemaType = z.infer<typeof IndicatorHistorySchema>
export type PartialIndicatorHistorySchemaType = z.infer<typeof PartialIndicatorHistorySchema>
export type IndicatorHistoryArraySchemaType = z.infer<typeof IndicatorHistoryArraySchema>
export type PartialIndicatorHistoryArraySchemaType = z.infer<typeof PartialIndicatorHistoryArraySchema>
