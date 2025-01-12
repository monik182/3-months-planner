import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { strategyHistoryHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const strategyId = request.nextUrl.searchParams.get('strategyId')

  if (!strategyId) {
    return new Response('Invalid strategy history id', { status: 400 })
  }

  try {
    const response = await strategyHistoryHandler.findMany({ strategy_id: strategyId })
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
