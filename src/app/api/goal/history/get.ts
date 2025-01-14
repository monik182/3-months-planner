import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { goalHistoryHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const goalId = request.nextUrl.searchParams.get('goalId') ?? undefined
  const planId = request.nextUrl.searchParams.get('planId') ?? undefined

  try {
    const response = await goalHistoryHandler.findMany({ goalId, planId })
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
