import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { indicatorHistoryHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const indicatorId = request.nextUrl.searchParams.get('indicatorId') ?? undefined
  const planId = request.nextUrl.searchParams.get('planId') ?? undefined

  try {
    const response = await indicatorHistoryHandler.findMany({ indicatorId, planId })
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
