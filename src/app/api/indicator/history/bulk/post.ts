import { indicatorHistoryHandler } from '@/db/prismaHandler'
import { formatError } from '@/lib/prismaHandler'
import { IndicatorHistoryArraySchema } from '@/lib/validators/indicatorHistory'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = IndicatorHistoryArraySchema.parse(data)
    const response = await indicatorHistoryHandler.createMany(parsedData)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
