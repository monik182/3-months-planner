import { userHandler } from '@/db/prismaHandler'
import { UserSchema } from '@/lib/validators/user'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data?.email) {
    return new Response(JSON.stringify({ message: 'Invalid email', ok: false }), { status: 400 })
  }

  try {
    const exists = await userHandler.findOneByEmail(data.email)

    if (!!exists) {
      return new Response(JSON.stringify({ message: 'The user is already registered', ok: false }), { status: 400 })
    }

    const parsedData = UserSchema.parse(data)
    const response = await userHandler.create(parsedData)
    return new Response(JSON.stringify({ ...response, ok: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
