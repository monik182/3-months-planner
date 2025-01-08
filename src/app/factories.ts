import { v4 as uuidv4 } from 'uuid'
import { Goal, Indicator, Plan, Strategy, Week } from '@/types'
import { DEFAULT_WEEKS } from '@/constants'
import { getDate, getPlanStartDate } from '@/util'

export function createPlan(): Plan {
  return {
    id: uuidv4(),
    vision: '',
    threeYearMilestone: '',
    goals: [],
    startDate: getPlanStartDate(),
    endDate: null,
    completed: false,
    created: getDate(),
    lastUpdated: getDate(),
    weeks: [],
  }
}

export function createGoal(): Goal {
  return {
    id: uuidv4(),
    weekId: '',
    score: 0,
    content: '',
    strategies: [createStrategy()],
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
