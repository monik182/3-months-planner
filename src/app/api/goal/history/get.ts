import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { goalHistoryHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const goalId = request.nextUrl.searchParams.get('goalId')

  if (!goalId) {
    return new Response('Invalid goal history id', { status: 400 })
  }

  try {
    const response = await goalHistoryHandler.findMany({ goal_id: goalId })
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
