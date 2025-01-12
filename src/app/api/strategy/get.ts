import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { strategiesHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const goalId = request.nextUrl.searchParams.get('goalId')

  if (!goalId) {
    return new Response('Invalid user id', { status: 400 })
  }

  try {
    const strategy = await strategiesHandler.findMany({ goal_id: goalId })
    return new Response(JSON.stringify(strategy), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
