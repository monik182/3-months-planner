import { strategiesHandler } from '@/db/prismaHandler'
import { formatError } from '@/lib/prismaHandler'
import { StrategySchema } from '@/lib/validators/strategy'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = StrategySchema.parse(data)
    const response = await strategiesHandler.create(parsedData)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
