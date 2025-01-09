import { v4 as uuidv4 } from 'uuid'
import { Goal, Indicator, Plan, Strategy, Week } from '@/types'
import { DEFAULT_WEEKS } from '@/constants'
import { calculatePlanEndDate, calculateWeekEndDate, calculateWeekStartDate, getDate, getPlanStartDate } from '@/util'

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

export function structurePlan(plan: Plan): Plan {
  const weeks = DEFAULT_WEEKS.map((week, index) => {
    const _week = plan.weeks[index]
    _week.startDate = calculateWeekStartDate(plan.startDate, parseInt(week))
    _week.endDate = calculateWeekEndDate(_week.startDate)
    // const weekGoals = plan.goals.filter((goal) => goal.strategies.)
    _week.goals = plan.goals.map((goal) => {
      return {
        ...goal,
        weekId: _week.id,
      }
    })
    _week.goals.forEach((goal) => {
      goal.strategies = goal.strategies
        .filter((strategy) => strategy.weeks.includes(week))
        .map((strategy) => {
          return {
            ...strategy,
            weekId: _week.id,
            firstUpdated: getDate(),
            lastUpdated: getDate(),
          }
        })

      goal.indicators.forEach((indicator) => {
        indicator.weekId = _week.id
      })
    })
    return _week
  })
  plan.weeks = weeks
  plan.endDate = calculatePlanEndDate(plan.startDate)
  plan.created = getDate()
  plan.lastUpdated = getDate()
  return plan
}

// TODO: create class??
