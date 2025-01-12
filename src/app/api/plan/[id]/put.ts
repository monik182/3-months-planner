import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { plansHandler } from '@/db/prismaHandler'
import { SegmentData } from '@/app/types'
import { PartialPlanSchema } from '@/lib/validators/plan'

export async function PUT(request: NextRequest, segmentData: SegmentData) {
  const params = await segmentData.params
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = PartialPlanSchema.parse(data)
    const plan = await plansHandler.update(params.id, parsedData)
    return new Response(JSON.stringify(plan), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
