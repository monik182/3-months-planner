import { waitlistHandler } from '@/db/supabaseHandler'

import { WaitlistSchema } from '@/lib/validators/waitlist'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data?.email) {
    return new Response(JSON.stringify({ message: 'Invalid email', ok: false }), { status: 400 })
  }

  // console.log(data)

  try {
    const parsedData = WaitlistSchema.parse(data)

    const exists = await waitlistHandler.findOne(data.email)

    if (!!exists) {
      return new Response(JSON.stringify({ message: 'This email is already in the waitlist', ok: false }), { status: 400 })
    }
    const response = await waitlistHandler.create(parsedData)
    return new Response(JSON.stringify({ ...response, ok: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
