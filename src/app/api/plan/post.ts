import { planHandler } from '@/db/prismaHandler'

import { PlanSchema } from '@/lib/validators/plan'
import { NextRequest } from 'next/server'
import dayjs from 'dayjs'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response(JSON.stringify({ message: 'Invalid data', ok: false }), { status: 400 })
  }

  try {
    const parsedData = PlanSchema.parse(data)

    if (dayjs(parsedData.startDate).isBefore(dayjs(), 'day')) {
      parsedData.started = true
    }

    const planInProgress = await planHandler.findInProgress(
      data.users.connect.id
    )

    if (!!planInProgress) {
      return new Response(JSON.stringify({ message: 'The user already has a plan in progress', ok: false }), { status: 400 })
    }

    const response = await planHandler.create(parsedData)
    return new Response(JSON.stringify({ ...response, ok: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
