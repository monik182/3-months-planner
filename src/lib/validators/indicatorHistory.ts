import { z } from 'zod'

export const IndicatorHistorySchema = z.object({
  id: z.string().cuid(),
  indicator_id: z.string().cuid(),
  value: z.number().int(),
  sequence: z.number().int(),
})

export const PartialIndicatorHistorySchema = IndicatorHistorySchema.partial()
export const IndicatorHistorySchemaSchema = z.array(IndicatorHistorySchema)
export const PartialIndicatorHistorySchemaSchema = z.array(PartialIndicatorHistorySchema)
export type IndicatorHistorySchemaType = z.infer<typeof IndicatorHistorySchema>
export type PartialIndicatorHistorySchemaType = z.infer<typeof PartialIndicatorHistorySchema>
export type IndicatorHistorySchemaSchemaType = z.infer<typeof IndicatorHistorySchemaSchema>
export type PartialIndicatorHistorySchemaSchemaType = z.infer<typeof PartialIndicatorHistorySchemaSchema>
