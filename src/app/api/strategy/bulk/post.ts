import { strategyHandler } from '@/db/supabaseHandler'

import { StrategyNoGoalSchemaArraySchema } from '@/lib/validators/strategy'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = StrategyNoGoalSchemaArraySchema.parse(data)
    const response = await strategyHandler.createMany(parsedData)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
