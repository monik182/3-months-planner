import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { indicatorHistoryHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const indicatorId = request.nextUrl.searchParams.get('indicatorId')

  if (!indicatorId) {
    return new Response('Invalid goal id', { status: 400 })
  }

  try {
    const response = await indicatorHistoryHandler.findMany({ indicator_id: indicatorId })
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
