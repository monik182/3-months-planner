import { indicatorHandler } from '@/db/prismaHandler'

import { IndicatorNoGoalArraySchema } from '@/lib/validators/indicator'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = IndicatorNoGoalArraySchema.parse(data)
    const response = await indicatorHandler.createMany(parsedData)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
