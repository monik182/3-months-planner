
import { NextRequest } from 'next/server'
import { indicatorHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const goalId = request.nextUrl.searchParams.get('goalId') ?? undefined
  const planId = request.nextUrl.searchParams.get('planId') ?? undefined
  const status = request.nextUrl.searchParams.get('status') ?? undefined

  try {
    const response = await indicatorHandler.findMany({ goalId, planId, status })
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
