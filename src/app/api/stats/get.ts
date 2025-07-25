import { waitlistHandler, userHandler } from '@/db/prismaHandler'
import { NextRequest } from 'next/server'

export async function GET(_: NextRequest) {
  try {
    const waitlist = await waitlistHandler.findMany()
    const users = await userHandler.findMany()
    return new Response(
      JSON.stringify({ waitlist: waitlist.length, users: users.length }),
      { status: 200 },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
