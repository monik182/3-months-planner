import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { indicatorHistoryHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const indicatorId = request.nextUrl.searchParams.get('indicatorId') ?? undefined
  const planId = request.nextUrl.searchParams.get('planId') ?? undefined
  const goalId = request.nextUrl.searchParams.get('goalId') ?? undefined
  const sequenceStr = request.nextUrl.searchParams.get('sequence')
  const sequence = sequenceStr && !isNaN(Number(sequenceStr)) ? Number(sequenceStr) : undefined

  try {
    let response
    if (goalId) {
      response = await indicatorHistoryHandler.findManyByGoalId(goalId, { indicatorId, planId, sequence })
    } else {
      response = await indicatorHistoryHandler.findMany({ indicatorId, planId, sequence })
    }
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
