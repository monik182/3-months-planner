import { goalHistoryHandler, indicatorHistoryHandler, strategyHistoryHandler } from '@/db/prismaHandler'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data || typeof data !== 'object') {
    return new NextResponse('Invalid or missing data', { status: 400 })
  }

  if (!data.goalHistory) {
    return new NextResponse('goal history is required', { status: 400 })
  }

  const { goalHistory, strategiesHistory, indicatorsHistory } = data

  try {

    await Promise.all([
      goalHistoryHandler.createMany(goalHistory),
      strategyHistoryHandler.createMany(strategiesHistory),
      indicatorHistoryHandler.createMany(indicatorsHistory),
    ]);

    const response = { message: "all was created successfully" }

    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.log('History error', error)
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
