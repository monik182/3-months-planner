import { PlanHistoryClass } from '@/app/types/PlanHistoryClass'
import { formatError } from '@/lib/prismaHandler'
import { goal_history, goals, indicator_history, indicators, plans, strategies, strategy_history } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data || typeof data !== 'object') {
    return new NextResponse('Invalid or missing data', { status: 400 })
  }

  const { plan, goals = [], strategies = [], indicators = [] } = data

  if (!plan) {
    return new NextResponse('Plan is required', { status: 400 })
  }

  const planHistoryInstance = new PlanHistoryClass(plan, goals, strategies, indicators)
  const goalHistoryList = planHistoryInstance.goalsToPrismaType()
  const strategyHistoryList = planHistoryInstance.strategiesToPrismaType()
  const indicatorHistoryList = planHistoryInstance.indicatorsToPrismaType()

  try {

    const planResponse = await makeRequest<plans, plans>(
      `${BASE_URL}/api/plan`,
      plan
    )

    const goalsResponse = await Promise.all(
      goals.map((goal: goals) => makeRequest<goals, goals[]>(`${BASE_URL}/api/goal`, goal))
    )

    const goalsHistoryResponse = await Promise.all(
      goalHistoryList.map((goal: goal_history) => makeRequest<goal_history, goal_history[]>(`${BASE_URL}/api/goal/history`, goal))
    )

    const strategiesResponse = await processArrayWithSettled<strategies, strategies[]>(
      strategies,
      `${BASE_URL}/api/strategy`
    )

    const strategiesHistoryResponse = await processArrayWithSettled<strategy_history, strategy_history[]>(
      strategyHistoryList,
      `${BASE_URL}/api/strategy/history`
    )

    const indicatorsResponse = await processArrayWithSettled<indicators, indicators[]>(
      indicators,
      `${BASE_URL}/api/indicator`
    )

    const indicatorsHistoryResponse = await processArrayWithSettled<indicator_history, indicator_history[]>(
      indicatorHistoryList,
      `${BASE_URL}/api/indicator/history`
    )

    const response = {
      plan: planResponse,
      goals: goalsResponse,
      goalsHistory: goalsHistoryResponse,
      strategies: strategiesResponse,
      strategiesHistory: strategiesHistoryResponse,
      indicators: indicatorsResponse,
      indicatorsHistory: indicatorsHistoryResponse,
    }

    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(formatError(error), { status: 500 })
  }
}

async function makeRequest<T, R>(url: string, data: T): Promise<R> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Request to ${url} failed: ${response.statusText}`)
  }

  return await response.json()
}

async function processArrayWithSettled<T, R>(
  array: T[],
  endpoint: string
): Promise<{ success: R[]; failed: string[] }> {
  const results = await Promise.allSettled(
    array.map((item) => makeRequest<T, R>(endpoint, item))
  )

  const success = results
    .filter((result): result is PromiseFulfilledResult<Awaited<R>> => result.status === 'fulfilled')
    .map((result) => result.value)

  const failed = results
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map((result) => result.reason?.message || 'Unknown error')

  return { success, failed }
}
