import { PlanHistoryClass } from '@/app/types/PlanHistoryClass'
import { formatError } from '@/lib/prismaHandler'
import { Goal, Indicator, Plan, Strategy } from '@prisma/client'
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

  // TODO: refactor this
  const planHistoryInstance = new PlanHistoryClass(plan, goals, strategies, indicators)
  // const goalHistoryList = planHistoryInstance.goalsToPrismaType()
  // const strategyHistoryList = planHistoryInstance.strategiesToPrismaType()
  // const indicatorHistoryList = planHistoryInstance.indicatorsToPrismaType()

  try {

    const planResponse = await makeRequest<Plan, Plan>('plan', plan)
    const goalsResponse = await makeRequest<Goal[], Goal[]>('goal/bulk', goals)

    const [
      strategiesResponse,
      indicatorsResponse,
    ] = await Promise.all([
      makeRequest<Strategy[], Strategy[]>('strategy/bulk', strategies),
      makeRequest<Indicator[], Indicator[]>('indicator/bulk', indicators),
    ])

    // const [
    //   goalsHistoryResponse,
    //   strategiesHistoryResponse,
    //   indicatorsHistoryResponse,
    // ] = await Promise.all([
    //   makeRequest<goal_history[], goal_history[]>('goal/history/bulk', goalHistoryList),
    //   makeRequest<strategy_history[], strategy_history[]>('strategy/history/bulk', strategyHistoryList),
    //   makeRequest<indicator_history[], indicator_history[]>('indicator/history/bulk', indicatorHistoryList),
    // ])


    const response = {
      plan: planResponse,
      goals: goalsResponse,
      // goalsHistory: goalsHistoryResponse,
      strategies: strategiesResponse,
      // strategiesHistory: strategiesHistoryResponse,
      indicators: indicatorsResponse,
      // indicatorsHistory: indicatorsHistoryResponse,
    }

    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    console.log('Deleting plan and relations...', error)
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

