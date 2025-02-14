import { SegmentData } from '@/app/types/types'
import { indicatorHandler } from '@/db/prismaHandler'

import { NextRequest } from 'next/server'

export async function DELETE(_: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params

  if (!params.id) {
    return new Response('Invalid indicator id', { status: 400 })
  }

  try {
    const response = await indicatorHandler.delete(params.id)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
