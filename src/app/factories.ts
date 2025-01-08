import { v4 as uuidv4 } from 'uuid'
import { Goal, Indicator, Plan, Strategy, Week } from '@/types'
import { DEFAULT_WEEKS } from '@/constants'
import { calculateWeekEndDate, calculateWeekStartDate, getDate, getPlanStartDate } from '@/util'

export function createPlan(userId: string): Plan {
  const startDate = getPlanStartDate()
  return {
    id: uuidv4(),
    userId,
    vision: '',
    threeYearMilestone: '',
    goals: [],
    startDate,
    endDate: null,
    completed: false,
    created: getDate(),
    lastUpdated: getDate(),
    weeks: createWeeks(startDate),
  }
}

export function createWeek(): Week {
  return {
    id: uuidv4(),
    startDate: null,
    endDate: null,
    weekNumber: 0,
    score: 0,
    goals: [],
  }
}

export function createGoal(): Goal {
  return {
    id: uuidv4(),
    weekId: '',
    score: 0,
    content: '',
    strategies: [],
    indicators: [],
  }
}

export function createStrategy(): Strategy {
  return {
    id: uuidv4(),
    content: '',
    weeks: [...DEFAULT_WEEKS],
    weekId: '',
    checked: false,
    firstUpdated: null,
    lastUpdated: null,
    overdue: false,
  }
}

export function createIndicator(): Indicator {
  return {
    id: uuidv4(),
    weekId: '',
    content: '',
    startingNumber: null,
    goalNumber: null,
    metric: '',
    trend: 0,
    value: 0,
  }
}

export function createWeeks(planStartDate: string): Week[] {
  return DEFAULT_WEEKS.map((week) => {
    const weekStartDate = calculateWeekStartDate(planStartDate, parseInt(week))
    const weekEndDate = calculateWeekEndDate(weekStartDate)
    return { ...createWeek(), weekStartDate, weekEndDate }
  })
}
