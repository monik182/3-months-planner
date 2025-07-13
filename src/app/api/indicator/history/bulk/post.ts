import { indicatorHistoryHandler } from '@/db/supabaseHandler'

import { IndicatorHistoryNoIndicatorArraySchema } from '@/lib/validators/indicatorHistory'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = IndicatorHistoryNoIndicatorArraySchema.parse(data)
    const response = await indicatorHistoryHandler.createMany(parsedData)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
