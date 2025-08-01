import { DEFAULT_WEEKS } from '@/app/constants'
import { DexiePlan, StrategyHistoryExtended } from '@/app/types/types'
import { Goal, Indicator, Plan, Prisma, Strategy } from '@prisma/client'
import dayjs from 'dayjs'

export function getDate(date?: Date) {
  return dayjs(date).toDate()
}

export function calculatePlanEndDate(startDate: Date): Date {
  return dayjs(startDate).add(12 * 7, 'day').toDate()
}

export function getPlanStartDate(startMonday = false) {
  const date = dayjs()
  const day = date.day()
  const diff = startMonday ? 1 : 7
  const nextDate = date.add(diff - day, 'day')
  return nextDate.toDate()
}

export function getNextStartDates(startMonday = false, n = 30): string[] {
  const dates = []
  const firstDate = dayjs(getPlanStartDate(startMonday))

  for (let i = 0; i < n; i++) {
    dates.push(firstDate.add(i * 7, 'day').format('YYYY-MM-DD')
    )
  }

  return dates
}

export function getCurrentWeekFromStartDate(startDate: Date) {
  const start = dayjs(startDate)
  const today = dayjs()

  const daysDifference = today.diff(start, 'day')

  return Math.ceil((daysDifference + 1) / 7)
}

export function calculateWeekEndDate(startDate: Date): Date {
  return dayjs(startDate).add(6, 'day').toDate();
}

export function calculateWeekStartDate(planStartDate: Date, weekNumber: number): Date {
  return dayjs(planStartDate).add((weekNumber - 1) * 7, 'day').toDate();
}

export function formatDate(date: Date | string, format = 'DD MMM') {
  return dayjs(date).format(format)
}

export function createGoalHistoryList(planId: string, goals: Goal[]): Prisma.GoalHistoryCreateManyInput[] {
  return goals.map((goal) => {
    return DEFAULT_WEEKS.map((week) => {
      return {
        planId,
        goalId: goal.id,
        sequence: parseInt(week),
        createdAt: null,
      }
    })
  }).flat()
}

export function createStrategyHistoryList(planId: string, strategies: Strategy[]): Prisma.StrategyHistoryCreateManyInput[] {
  return strategies.map((strategy) => {
    return DEFAULT_WEEKS.map((week) => {
      return {
        planId,
        sequence: parseInt(week),
        strategyId: strategy.id,
        firstUpdate: null,
        lastUpdate: null,
        createdAt: null,
      }
    })
  }).flat()
}

export function createIndicatorHistoryList(planId: string, indicators: Indicator[]): Prisma.IndicatorHistoryCreateManyInput[] {
  return indicators?.map((indicator) => {
    return DEFAULT_WEEKS.map((week) => {
      return {
        planId,
        sequence: parseInt(week),
        indicatorId: indicator.id,
        value: 0,
        createdAt: null,
      }
    })
  }).flat()
}

export function calculateCompletionScore(strategies: StrategyHistoryExtended[]): number {

  if (!strategies.length) {
    return 0
  }

  let totalScore = 0

  for (const strategy of strategies) {
    const { strategy: { frequency }, frequencies } = strategy
    const completedTimes = frequencies.filter(Boolean).length
    const strategyScore = frequency === 0 ? 1 : Math.min(1, completedTimes / frequency)
    totalScore += strategyScore
  }

  const total = totalScore / strategies.length
  return Math.floor(total * 100)
}

export function dexieToPlan(plan: DexiePlan): Plan {
  return {
    ...plan,
    completed: Boolean(plan.completed),
    started: Boolean(plan.started)
  }
}


export function planToDexie(plan: Plan): DexiePlan {
  return {
    ...plan,
    completed: Number(Boolean(plan.completed)),
    started: Number(Boolean(plan.started))
  }
}

export function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, callback: () => void) {
  if (event.code === 'Enter' || event.key === 'Enter') {
    callback()
  }
}

export async function generateNonce(): Promise<string[]> {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
  const encoder = new TextEncoder()
  const encodedNonce = encoder.encode(nonce)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return [nonce, hashedNonce]
}
