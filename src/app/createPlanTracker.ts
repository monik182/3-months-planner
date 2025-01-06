import { WEEKS } from './constants'
import { Plan, PlanTracking } from './types'
import { v4 as uuidv4 } from 'uuid'
import { calculateWeekEndDate, calculateWeekStartDate } from './util'

export function createPlanTracker(plan: Plan): PlanTracking {

  const weeks = WEEKS.map((week) => {
    const weekId = uuidv4()
    const weekStartDate = calculateWeekStartDate(plan.startDate, week)

    return {
      id: weekId,
      score: 0,
      weekNumber: week,
      startDate: weekStartDate,
      endDate: calculateWeekEndDate(weekStartDate),
      goals: plan.goals.map((goal) => {
        return {
          ...goal,
          score: 0,
          weekId,
          strategies: goal.strategies.filter((strategy) => strategy.weeks.includes(week.toString())).map((strategy) => {
            return {
              ...strategy,
              weekId,
              checked: false,
              firstUpdated: '',
              lastUpdated: '',
              overdue: false
            }
          }),
          indicators: goal.indicators.map((indicator) => {
            return {
              ...indicator,
              weekId,
              trend: 0,
              value: indicator.startingNumber || 0
            }
          })
        }
      }),
    }

  })

  return {
    ...plan,
    weeks,
  }
}
