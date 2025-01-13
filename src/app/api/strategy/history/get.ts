import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { strategyHistoryHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const strategyId = request.nextUrl.searchParams.get('strategyId') ?? undefined
  const planId = request.nextUrl.searchParams.get('planId') ?? undefined

  try {
    const response = await strategyHistoryHandler.findMany({ strategyId, planId })
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
