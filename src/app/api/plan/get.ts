
import { NextRequest } from 'next/server'
import { planHandler } from '@/db/supabaseHandler'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')

  if (!userId) {
    return new Response('Invalid user id', { status: 400 })
  }

  try {
    const response = await planHandler.findInProgress(userId)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
