import { userHandler } from '@/db/prismaHandler'
import { UserSchema } from '@/lib/validators/user'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data?.email) {
    return new Response(JSON.stringify({ message: 'Invalid email', ok: false }), { status: 400 })
  }

  try {
    const existingUser = await userHandler.findOneByEmail(data.email)

    if (!!existingUser) {
      return new Response(JSON.stringify({ ...existingUser, ok: true }), { status: 200 })
    }

    const parsedData = UserSchema.parse(data)
    const response = await userHandler.create(parsedData)
    return new Response(JSON.stringify({ ...response, ok: true }), { status: 201 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
