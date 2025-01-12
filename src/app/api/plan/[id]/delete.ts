import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { plansHandler } from '@/db/prismaHandler'
import { SegmentData } from '@/app/types'

export async function DELETE(request: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params

  try {
    // TODO: remove this and do a put to update status
    await plansHandler.delete(params.id)
    return new Response(JSON.stringify({ deleted: true }), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
