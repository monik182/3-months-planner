import { planHandler } from '@/db/prismaHandler'

import { PlanSchema } from '@/lib/validators/plan'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = PlanSchema.parse(data)
    const planInProgress = await planHandler.findInProgress(data.userId)

    if (!!planInProgress) {
      return new Response("The user already has a plan in progress", { status: 400 })
    }

    const response = await planHandler.create(parsedData)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
