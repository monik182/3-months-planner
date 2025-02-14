import { SegmentData } from '@/app/types/types'
import { strategyHandler } from '@/db/prismaHandler'
import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'

export async function DELETE(_: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params

  if (!params.id) {
    return new Response('Invalid strategy id', { status: 400 })
  }

  try {
    const response = await strategyHandler.delete(params.id)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
