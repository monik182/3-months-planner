import { NextRequest } from 'next/server'
import { strategyHistoryHandler } from '@/db/prismaHandler'

export async function GET(request: NextRequest) {
  const planId = request.nextUrl.searchParams.get('planId')
  if (!planId) {
    return new Response('Invalid plan id', { status: 400 })
  }

  try {
    const histories = await strategyHistoryHandler.findMany({ planId })
    const strategyData: Record<string, number[]> = {}
    const goalAccum: Record<string, { totals: number[]; counts: number[] }> = {}

    histories.forEach((h) => {
      const seqIndex = h.sequence - 1
      const freq = h.strategy.frequency || 0
      const completed = h.frequencies.filter(Boolean).length
      const percent = freq ? Math.min(100, (completed / freq) * 100) : 100

      if (!strategyData[h.strategyId]) {
        strategyData[h.strategyId] = Array(12).fill(0)
      }
      strategyData[h.strategyId][seqIndex] = percent

      const goalId = h.strategy.goalId
      if (!goalAccum[goalId]) {
        goalAccum[goalId] = { totals: Array(12).fill(0), counts: Array(12).fill(0) }
      }
      goalAccum[goalId].totals[seqIndex] += percent
      goalAccum[goalId].counts[seqIndex] += 1
    })

    const goalData: Record<string, number[]> = {}
    Object.entries(goalAccum).forEach(([goalId, val]) => {
      goalData[goalId] = val.totals.map((t, idx) => (val.counts[idx] ? t / val.counts[idx] : 0))
    })

    return new Response(JSON.stringify({ strategies: strategyData, goals: goalData }), {
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
