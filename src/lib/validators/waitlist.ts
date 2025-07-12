import cuid from 'cuid'
import { z } from 'zod'

export const WaitlistSchema = z.object({
  id: z.string().default(() => cuid()),
  email: z.email(),
  name: z.string().optional(),
  inviteToken: z.string().default(() => cuid()).nullable(),
  position: z.number().int().default(0),
  invited: z.boolean().default(false),
  invitedAt: z.date().default(() => new Date()),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export const PartialWaitlistSchema = WaitlistSchema.partial()
export const WaitlistArraySchema = z.array(WaitlistSchema)
export const PartialWaitlistArraySchema = z.array(PartialWaitlistSchema)
export type WaitlistSchemaType = z.infer<typeof WaitlistSchema>
export type PartialWaitlistSchemaType = z.infer<typeof PartialWaitlistSchema>
export type WaitlistArraySchemaType = z.infer<typeof WaitlistArraySchema>
export type PartialWaitlistArraySchemaType = z.infer<typeof PartialWaitlistArraySchema>
