import { goalHandler } from '@/db/supabaseHandler'

import { GoalArraySchema } from '@/lib/validators/goal'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const parsedData = GoalArraySchema.parse(data)
    const response = await goalHandler.createMany(parsedData)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.log('error on goal bulk', error)
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
