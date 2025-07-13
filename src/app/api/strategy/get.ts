
import { NextRequest } from 'next/server'
import { strategyHandler } from '@/db/supabaseHandler'

export async function GET(request: NextRequest) {
  const goalId = request.nextUrl.searchParams.get('goalId') ?? undefined
  const status = request.nextUrl.searchParams.get('status') ?? undefined
  const planId = request.nextUrl.searchParams.get('planId') ?? undefined

  try {
    const response = await strategyHandler.findMany({ goalId, status, planId })
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
