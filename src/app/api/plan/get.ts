import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { plansHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')

  if (!userId) {
    return new Response('Invalid user id', { status: 400 })
  }

  try {
    const response = await plansHandler.findCurrent(userId)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
