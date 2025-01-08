import { WEEKS } from './constants'
import { Plan } from './types'
import { v4 as uuidv4 } from 'uuid'
import { calculateWeekEndDate, calculateWeekStartDate, isStrategyOverdue } from './util'

export function createPlanTracker(plan: Plan): Plan {

  const weeks = WEEKS.map((week) => {
    const weekId = uuidv4()
    const weekStartDate = calculateWeekStartDate(plan.startDate, week)
    const weekEndDate = calculateWeekEndDate(weekStartDate)

    return {
      id: weekId,
      score: 0,
      weekNumber: week,
      startDate: weekStartDate,
      endDate: weekEndDate,
      goals: plan.goals.map((goal) => {
        return {
          ...goal,
          score: 0,
          weekId,
          strategies: goal.strategies
            .filter((strategy) => strategy.weeks.includes(week.toString()))
            .map((strategy) => {
              const formattedStrategy = {
                ...strategy,
                weekId,
                checked: false,
                firstUpdated: '',
                lastUpdated: '',
                overdue: false,
              }
              formattedStrategy.overdue = isStrategyOverdue(formattedStrategy, weekEndDate)
              return formattedStrategy
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
