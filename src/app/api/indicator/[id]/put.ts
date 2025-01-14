import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { indicatorHandler } from '@/db/prismaHandler'
import { SegmentData } from '@/app/types/types'
import { PartialIndicatorSchema } from '@/lib/validators/indicator'

export async function PUT(request: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = PartialIndicatorSchema.parse(data)
    const indicator = await indicatorHandler.update(params.id, parsedData)
    return new Response(JSON.stringify(indicator), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
