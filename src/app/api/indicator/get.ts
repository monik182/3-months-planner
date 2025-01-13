import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { indicatorHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const goalId = request.nextUrl.searchParams.get('goalId')
  const planId = request.nextUrl.searchParams.get('planId') ?? undefined
  const status = request.nextUrl.searchParams.get('status') ?? undefined

  if (!goalId) {
    return new Response('Invalid goal id', { status: 400 })
  }

  try {
    const response = await indicatorHandler.findMany({ goalId, planId, status })
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
