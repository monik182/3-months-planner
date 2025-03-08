import { SegmentData } from '@/app/types/types'
import { userHandler } from '@/db/prismaHandler'
import { PartialUserSchema } from '@/lib/validators/user'
import { NextRequest } from 'next/server'

export async function PUT(request: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params
  const data = await request.json()

  if (!params.id || !data) {
    return new Response(JSON.stringify({ message: 'Invalid data', ok: false }), { status: 400 })
  }

  try {
    const parsedData = PartialUserSchema.parse(data)
    const response = await userHandler.update(params.id, parsedData)
    return new Response(JSON.stringify({ ...response, ok: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
