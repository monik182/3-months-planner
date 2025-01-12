import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { goalsHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const planId = request.nextUrl.searchParams.get('planId')

  if (!planId) {
    return new Response('Invalid user id', { status: 400 })
  }

  try {
    const goal = await goalsHandler.findMany({ plan_id: planId })
    return new Response(JSON.stringify(goal), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}

// TODO: create get by status
