
import { NextRequest } from 'next/server'
import { planHandler } from '@/db/prismaHandler'
import { SegmentData } from '@/app/types/types'

export async function DELETE(request: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params

  try {
    // TODO: remove this and do a put to update status
    await planHandler.delete(params.id)
    return new Response(JSON.stringify({ deleted: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
