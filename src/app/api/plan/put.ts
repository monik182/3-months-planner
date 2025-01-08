import { formatError, prismaHandler } from '@/lib/prismaHandler'
import { NextRequest } from 'next/server'
import { planManager } from '@/db/planManager'

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  const body = await request.json()
  const { updates } = body

  if (!id) {
    return new Response('Invalid user id', { status: 400 })
  }

  if (!updates) {
    return new Response('Invalid data', { status: 400 })
  }

  try {
    const plan = await prismaHandler(() => planManager.updatePlan(id, updates))
    return new Response(JSON.stringify(plan), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
