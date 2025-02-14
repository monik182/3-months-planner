import { strategyHistoryHandler } from '@/db/prismaHandler'

import { StrategyHistorySchema } from '@/lib/validators/strategyHistory'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = StrategyHistorySchema.parse(data)
    const response = await strategyHistoryHandler.create(parsedData)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
