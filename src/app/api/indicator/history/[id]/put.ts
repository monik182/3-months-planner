
import { NextRequest } from 'next/server'
import { indicatorHistoryHandler } from '@/db/supabaseHandler'
import { SegmentData } from '@/app/types/types'
import { PartialIndicatorHistorySchema } from '@/lib/validators/indicatorHistory'

export async function PUT(request: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = PartialIndicatorHistorySchema.parse(data)
    const indicator = await indicatorHistoryHandler.update(params.id, parsedData)
    return new Response(JSON.stringify(indicator), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
