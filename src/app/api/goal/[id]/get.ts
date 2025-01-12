import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { goalsHandler } from '@/db/prismaHandler'
import { SegmentData } from '@/app/types'

export async function GET(_: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params

  if (!params.id) {
    return new Response('Invalid goal id', { status: 400 })
  }

  try {
    const response = await goalsHandler.findOne(params.id)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
