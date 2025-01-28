import { DEFAULT_WEEKS } from '@/app/constants'
import { Goal, Indicator, Prisma, Strategy } from '@prisma/client'
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

export function calculateWeekEndDate(startDate: Date) {
  const start = dayjs(startDate)
  const isSunday = start.day() === 0
  if (isSunday) {
    return start.add(6, 'day').toDate()
  }
  return start.add(6, 'day').toDate()
}

export function calculateWeekStartDate(startDate: Date, weekNumber: number) {
  const start = dayjs(startDate).add((weekNumber - 1) * 7, 'day')
  return start.toDate()
}

export function formatDate(date: Date | string, format = 'DD MMM') {
  return dayjs(date).format(format)
}

export function createGoalHistoryList(planId: string, goals: Goal[]): Prisma.GoalHistoryCreateManyInput[] {
  return goals.map((goal) => {
    return DEFAULT_WEEKS.map((week) => {
      const sequence = parseInt(week)
      return {
        planId,
        goalId: goal.id,
        sequence,
      }
    })
  }).flat()
}

export function createStrategyHistoryList(planId: string, strategies: Strategy[]): Prisma.StrategyHistoryCreateManyInput[] {
  return strategies.map((strategy) => {
    return strategy.weeks.map((week) => {
      const sequence = parseInt(week)
      return {
        planId,
        sequence,
        strategyId: strategy.id,
      }
    })
  }).flat()
}

export function createIndicatorHistoryList(planId: string, indicators: Indicator[]): Prisma.IndicatorHistoryCreateManyInput[] {
  return indicators.map((indicator) => {
    return DEFAULT_WEEKS.map((week) => {
      const sequence = parseInt(week)
      return {
        planId,
        sequence,
        indicatorId: indicator.id,
        value: 0,
      }
    })
  }).flat()
}
