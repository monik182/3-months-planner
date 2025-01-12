import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { strategiesHandler } from '@/db/prismaHandler'
import { SegmentData } from '@/app/types'

export async function GET(_: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params

  if (!params.id) {
    return new Response('Invalid strategy id', { status: 400 })
  }

  try {
    const response = await strategiesHandler.findOne(params.id)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
