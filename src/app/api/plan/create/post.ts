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

    const planResponse = await makeRequest<plans, plans>('plan', plan)

    const goalsResponse = await processArray<goals, goals>('goal', goals)
    const goalsHistoryResponse = await processArray<goal_history, goal_history>('goal/history', goalHistoryList)

    const strategiesResponse = await processArray<strategies, strategies>('strategy', strategies)
    const strategiesHistoryResponse = await processArray<strategy_history, strategy_history>('strategy/history', strategyHistoryList)

    const indicatorsResponse = await processArray<indicators, indicators>('indicator', indicators)
    const indicatorsHistoryResponse = await processArray<indicator_history, indicator_history>('indicator/history', indicatorHistoryList)

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
    console.log('Deleting plan and relations...')
    const planExists = await makeRequest<plans, plans>(`plan/${plan.id}`, undefined, 'GET')
    if (!!planExists) {
      await makeRequest<plans, plans>(`plan/${plan.id}`, undefined, 'DELETE')
    }
    return new Response(formatError(error), { status: 500 })
  }
}

async function makeRequest<T, R>(url: string, data: T | undefined, method = 'POST'): Promise<R> {
  const response = await fetch(`${BASE_URL}/api/${url}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    throw new Error(`Request to ${url} failed: ${response.statusText}`)
  }

  return await response.json()
}

async function processArray<T, R>(url: string, array: T[]): Promise<R[]> {
  return Promise.all(
    array.map((item: T) => makeRequest<T, R>(url, item))
  )
}
