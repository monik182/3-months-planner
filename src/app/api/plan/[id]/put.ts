
import { NextRequest } from 'next/server'
import { planHandler } from '@/db/prismaHandler'
import { SegmentData } from '@/app/types/types'
import { PartialPlanSchema } from '@/lib/validators/plan'

export async function PUT(request: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = PartialPlanSchema.omit({ id: true }).parse(data)
    const response = await planHandler.update(params.id, parsedData)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
