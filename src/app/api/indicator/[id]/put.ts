import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { indicatorsHandler } from '@/db/prismaHandler'
import { SegmentData } from '@/app/types'

export async function PUT(request: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params
  const body = await request.json()
  const { updates } = body


  if (!params.id) {
    return new Response('Invalid indicator id', { status: 400 })
  }

  if (!updates) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const indicator = await indicatorsHandler.update(params.id, updates)
    return new Response(JSON.stringify(indicator), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
