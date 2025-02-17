import { userHandler, waitlistHandler } from '@/db/prismaHandler'

import { WaitlistSchema } from '@/lib/validators/waitlist'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data?.email) {
    return new Response(JSON.stringify({ message: 'Invalid email', ok: false }), { status: 400 })
  }

  try {
    const parsedData = WaitlistSchema.parse(data)

    const exists = await userHandler.findOne(data)

    if (!!exists) {
      return new Response(JSON.stringify({ message: 'The user is already registered', ok: false }), { status: 400 })
    }
    const response = await waitlistHandler.create(parsedData)
    return new Response(JSON.stringify({ ...response, ok: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
