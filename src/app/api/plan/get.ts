import { formatError, prismaHandler } from '@/lib/prismaHandler'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')

  if (!userId) {
    return new Response('Invalid user id', { status: 400 })
  }

  try {
    const plan = await prismaHandler(() =>
      prisma.plan.findFirst({
        where: { userId: userId as string, completed: false },
        include: {
          weeks: {
            include: {
              goals: {
                include: {
                  strategies: true,
                  indicators: true,
                },
              },
            },
          },
        },
      })
    )
    return new Response(JSON.stringify(plan), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}
