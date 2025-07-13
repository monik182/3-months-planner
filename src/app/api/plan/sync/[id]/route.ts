import { SegmentData } from '@/app/types/types'
import { planHandler } from '@/db/supabaseHandler'

import { PartialPlanSchema, PlanSchema } from '@/lib/validators/plan'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params
  const data = await request.json()

  if (!data || !params?.id) {
    return new Response(JSON.stringify({ message: 'Invalid data', ok: false }), { status: 400 })
  }

  try {
    const exists = await planHandler.findOne(params.id)

    if (!!exists) {
      const parsedData = PartialPlanSchema.parse(data)
      const response = await planHandler.update(params.id, parsedData)
      return new Response(JSON.stringify({ ...response, ok: true }), { status: 200 })
    }

    const parsedData = PlanSchema.parse(data)
    const response = await planHandler.create(parsedData)
    return new Response(JSON.stringify({ ...response, ok: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
