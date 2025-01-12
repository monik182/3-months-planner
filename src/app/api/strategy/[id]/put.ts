import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { strategiesHandler } from '@/db/prismaHandler'
import { SegmentData } from '@/app/types'
import { PartialStrategySchema } from '@/lib/validators/strategy'

export async function PUT(request: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = PartialStrategySchema.parse(data)
    const response = await strategiesHandler.update(params.id, parsedData)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
