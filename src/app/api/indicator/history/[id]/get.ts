
import { NextRequest } from 'next/server'
import { indicatorHistoryHandler } from '@/db/supabaseHandler'
import { SegmentData } from '@/app/types/types'

export async function GET(_: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params

  if (!params.id) {
    return new Response('Invalid indicator history id', { status: 400 })
  }

  try {
    const response = await indicatorHistoryHandler.findOne(params.id)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
