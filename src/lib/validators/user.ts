import { Role } from '@prisma/client'
import cuid from 'cuid'
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().default(() => cuid()),
  auth0Id: z.string().optional(),
  email: z.string().email(),
  role: z.nativeEnum(Role).default(Role.USER),
  waitlistId: z.string().optional().nullable(),
  createdAt: z.preprocess((arg) => (typeof arg === 'string' ? new Date(arg) : arg), z.date()),
})

export const PartialUserSchema = UserSchema.partial()
export const UserArraySchema = z.array(UserSchema)
export const PartialUserArraySchema = z.array(PartialUserSchema)
export type UserSchemaType = z.infer<typeof UserSchema>
export type PartialUserSchemaType = z.infer<typeof PartialUserSchema>
export type UserArraySchemaType = z.infer<typeof UserArraySchema>
export type PartialUserArraySchemaType = z.infer<typeof PartialUserArraySchema>
