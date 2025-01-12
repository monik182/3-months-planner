import { plansHandler } from '@/db/prismaHandler'
import { formatError } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'

// TODO: create this one
export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const response = await plansHandler.create(data)
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
