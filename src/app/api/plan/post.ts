import { formatError, prismaHandler } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { planManager } from '@/db/planManager'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const plan = await prismaHandler(() => planManager.createPlan(data))
    return new Response(JSON.stringify(plan), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
