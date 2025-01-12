import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { indicatorsHandler } from '@/db/prismaHandler'
import { SegmentData } from '@/app/types'

export async function PUT(request: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const indicator = await indicatorsHandler.update(params.id, data)
    return new Response(JSON.stringify(indicator), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
