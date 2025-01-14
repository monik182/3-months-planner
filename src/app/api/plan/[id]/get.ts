import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { planHandler } from '@/db/prismaHandler'
import { SegmentData } from '@/app/types/types'


export async function GET(_: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params

  if (!params.id) {
    return new Response('Invalid plan id', { status: 400 })
  }

  try {
    const response = await planHandler.findOne(params.id)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
