import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { goalsHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const planId = request.nextUrl.searchParams.get('planId')
  const status = request.nextUrl.searchParams.get('status') ?? undefined

  if (!planId) {
    return new Response('Invalid user id', { status: 400 })
  }

  try {
    const response = await goalsHandler.findMany({ plan_id: planId, status })
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
