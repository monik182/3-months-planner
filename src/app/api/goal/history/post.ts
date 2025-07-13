import { goalHistoryHandler } from '@/db/supabaseHandler'

import { GoalHistorySchema } from '@/lib/validators/goalHistory'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = GoalHistorySchema.parse(data)
    const response = await goalHistoryHandler.create(parsedData)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
