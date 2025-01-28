import { createGoalHistoryList, createIndicatorHistoryList, createStrategyHistoryList } from '@/app/util'
import { goalHandler, goalHistoryHandler, indicatorHandler, indicatorHistoryHandler, strategyHandler, strategyHistoryHandler } from '@/db/prismaHandler'
import { formatError } from '@/lib/prismaHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data || typeof data !== 'object') {
    return new NextResponse('Invalid or missing data', { status: 400 })
  }

  if (!data.planId) {
    return new NextResponse('planId is required', { status: 400 })
  }

  const { planId } = data

  try {
    const goals = (await goalHandler.findMany({ planId }, { id: true })) || []
    const strategies = (await strategyHandler.findMany({ planId }, { id: true, weeks: true })) || []
    const indicators = (await indicatorHandler.findMany({ planId }, { id: true })) || []

    const goalHistory = createGoalHistoryList(planId, goals)
    const strategiesHistory = createStrategyHistoryList(planId, strategies)
    const indicatorsHistory = createIndicatorHistoryList(planId, indicators)

    await Promise.all([
      goalHistoryHandler.createMany(goalHistory),
      strategyHistoryHandler.createMany(strategiesHistory),
      indicatorHistoryHandler.createMany(indicatorsHistory),
    ]);

    const response = { message: "all was created successfully" }

    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.log('History error', error)
    return new Response(formatError(error), { status: 500 })
  }
}
