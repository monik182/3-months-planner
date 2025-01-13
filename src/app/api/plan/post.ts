import { planHandler } from '@/db/prismaHandler'
import { formatError } from '@/lib/prismaHandler'
import { PlanSchema } from '@/lib/validators/plan'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = PlanSchema.parse(data)
    const response = await planHandler.create(parsedData)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
