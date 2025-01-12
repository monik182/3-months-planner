import { z } from 'zod'

export const IndicatorHistorySchema = z.object({
  id: z.string().cuid().optional(),
  indicator_id: z.string().cuid(),
  value: z.number(),
})

export const PartialIndicatorHistorySchema = IndicatorHistorySchema.partial()
export type IndicatorHistorySchemaType = z.infer<typeof IndicatorHistorySchema>
export type PartialIndicatorHistorySchemaType = z.infer<typeof PartialIndicatorHistorySchema>
