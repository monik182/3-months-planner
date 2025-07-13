import { planHandler } from '@/db/supabaseHandler'

import { PlanSchema } from '@/lib/validators/plan'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response(JSON.stringify({ message: 'Invalid data', ok: false }), { status: 400 })
  }

  try {
    const parsedData = PlanSchema.parse(data)
    const planInProgress = await planHandler.findInProgress(data.userId)

    if (!!planInProgress) {
      return new Response(JSON.stringify({ message: 'The user already has a plan in progress', ok: false }), { status: 400 })
    }

    const response = await planHandler.create(parsedData)
    return new Response(JSON.stringify({ ...response, ok: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
