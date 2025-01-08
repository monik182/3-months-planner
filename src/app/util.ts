import dayjs from 'dayjs'
import { Goal, Plan, Strategy, Week } from './types'

export function getDate() {
  return dayjs().format('YYYY-MM-DD')
}

export function calculatePlanEndDate(startDate: string): string {
  return dayjs(startDate).add(12 * 7, 'day').format('YYYY-MM-DD')
}

export function getPlanStartDate(startMonday = false): string {
  const date = dayjs()
  const day = date.day()
  const diff = startMonday ? 1 : 7
  const nextDate = date.date() + (diff - day)
  date.date(nextDate)

  return date.format('YYYY-MM-DD')
}

export function getNextStartDates(startMonday = false, n = 30): string[] {
  const dates = []
  const firstDate = dayjs(getPlanStartDate(startMonday))

  for (let i = 0; i < n; i++) {
    dates.push(firstDate.add(i * 7, 'day').format('YYYY-MM-DD'))
  }

  return dates
}

export function getCurrentWeekFromStartDate(startDate: string) {
  const start = dayjs(startDate)
  const today = dayjs()

  const daysDifference = today.diff(start, 'day')

  return Math.ceil((daysDifference + 1) / 7)
}

export function calculateWeekEndDate(startDate: string) {
  const start = dayjs(startDate)
  const isSunday = start.day() === 0
  if (isSunday) {
    return start.add(6, 'day').format('YYYY-MM-DD')
  }
  return start.add(6, 'day').format('YYYY-MM-DD')
}

export function calculateWeekStartDate(startDate: string, weekNumber: number) {
  const start = dayjs(startDate).add((weekNumber - 1) * 7, 'day')
  return start.format('YYYY-MM-DD')
}

export const calculateGoalScore = (goal: Goal): number => {
  const strategyScore =
    goal.strategies.length > 0
      ? (goal.strategies.filter((str) => str.checked).length /
        goal.strategies.length) *
      100
      : 0

  return Math.round(strategyScore)
}

export const calculateWeekScore = (goals: Goal[]): number => {
  const totalStrategies = goals.reduce(
    (acc, goal) => acc + goal.strategies.length,
    0
  )

  const totalCheckedStrategies = goals.reduce(
    (acc, goal) =>
      acc + goal.strategies.filter((strategy) => strategy.checked).length,
    0
  )

  return totalStrategies > 0
    ? Math.round((totalCheckedStrategies / totalStrategies) * 100)
    : 0
}

export const calculateIndicatorTrend = (
  indicatorId: string,
  currentWeek: Week,
  previousWeek?: Week,
): number => {
  if (!previousWeek) {
    return 0
  }

  const currentIndicator = currentWeek.goals
    .flatMap((goal) => goal.indicators)
    .find((indicator) => indicator.id === indicatorId)

  const previousIndicator = previousWeek.goals
    .flatMap((goal) => goal.indicators)
    .find((indicator) => indicator.id === indicatorId)


  if (!currentIndicator || !previousIndicator || currentIndicator.goalNumber == null) {
    return 0
  }

  const goalRange = currentIndicator.goalNumber - (currentIndicator.startingNumber || 0)

  if (goalRange === 0) {
    return 0
  }

  const currentProgress = currentIndicator.value - (currentIndicator.startingNumber || 0)
  const previousProgress = previousIndicator.value - (previousIndicator.startingNumber || 0)

  return Math.round(((currentProgress - previousProgress) / goalRange) * 100)
}

export function getChartData(plan: Plan) {
  return plan.weeks.map((week) => {
    return {
      label: `Week ${week.weekNumber}`,
      score: week.score,
    }
  })
}

export function isStrategyOverdue(strategy: Strategy, weekEndDate: string): boolean {
  const end = dayjs(weekEndDate)
  const today = dayjs()
  const overdue = today.isAfter(end, 'day')

  if (overdue && !strategy.firstUpdated && !strategy.checked) {
    return true
  }

  return false
}
