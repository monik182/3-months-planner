
import { NextRequest } from 'next/server'
import { userHandler } from '@/db/prismaHandler'
import { SegmentData } from '@/app/types/types'

export async function GET(_: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params

  if (!params) {
    return new Response('Invalid user data', { status: 400 })
  }

  try {
    const response = await userHandler.findOne(params.id)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
