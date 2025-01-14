import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { goalHistoryHandler } from '@/db/prismaHandler'
import { SegmentData } from '@/app/types/types'
import { PartialGoalHistorySchema } from '@/lib/validators/goalHistory'

export async function PUT(request: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = PartialGoalHistorySchema.parse(data)
    const response = await goalHistoryHandler.update(params.id, parsedData)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
