import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { goalHistoryHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const goalId = request.nextUrl.searchParams.get('goalId') ?? undefined
  const planId = request.nextUrl.searchParams.get('planId') ?? undefined
  const status = request.nextUrl.searchParams.get('status') ?? undefined
  const sequenceStr = request.nextUrl.searchParams.get('sequence')
  const sequence = sequenceStr && !isNaN(Number(sequenceStr)) ? Number(sequenceStr) : undefined

  try {
    const response = await goalHistoryHandler.findMany({ goalId, planId, sequence }, status)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
