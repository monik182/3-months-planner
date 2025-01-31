import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { strategyHistoryHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const strategyId = request.nextUrl.searchParams.get('strategyId') ?? undefined
  const status = request.nextUrl.searchParams.get('status') ?? undefined
  const planId = request.nextUrl.searchParams.get('planId') ?? undefined
  const goalId = request.nextUrl.searchParams.get('goalId') ?? undefined
  const sequenceStr = request.nextUrl.searchParams.get('sequence') ?? undefined
  const sequence = sequenceStr && !isNaN(Number(sequenceStr)) ? Number(sequenceStr) : undefined

  try {
    let response
    if (goalId) {
      response = await strategyHistoryHandler.findManyByGoalId(goalId, { strategyId, planId, sequence }, sequenceStr, status)
    } else {
      response = await strategyHistoryHandler.findMany({ strategyId, planId, sequence }, sequenceStr, status)
    }
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
