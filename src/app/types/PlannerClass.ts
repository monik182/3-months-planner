import { v4 as uuidv4 } from 'uuid'
import { Goal, Indicator, Plan, Status, Strategy } from '@/types'
import { calculatePlanEndDate, getDate, getPlanStartDate } from '../util'
import { DEFAULT_WEEKS } from '../constants'

export class PlanClass {
  private userId: string
  private plan: Plan
  private goals: Goal[] = []
  private strategies: Strategy[] = []
  private indicators: Indicator[] = []

  constructor(userId: string) {
    this.userId = userId
    this.plan = this.createPlan()
  }

  private createPlan(): Plan {
    const startDate = getPlanStartDate()
    return {
      id: uuidv4(),
      userId: this.userId,
      vision: '',
      milestone: '',
      completed: false,
      startDate,
      endDate: calculatePlanEndDate(startDate),
      created: getDate(),
      lastUpdate: getDate(),
    }
  }

  createGoal(): Goal {
    return {
      id: uuidv4(),
      planId: this.plan.id,
      content: '',
      status: Status.ACTIVE,
    }
  }

  createStrategy(goalId: string): Strategy {
    return {
      id: uuidv4(),
      goalId,
      content: '',
      weeks: [...DEFAULT_WEEKS],
      status: Status.ACTIVE,
    }
  }

  createIndicator(goalId: string): Indicator {
    return {
      id: uuidv4(),
      goalId,
      content: '',
      metric: '',
      startingValue: 0,
      goalValue: 0,
      status: Status.ACTIVE,
    }
  }

  saveGoal(goal: Goal) {
    this.goals = [...this.goals, goal]
  }

  saveIndicator(indicator: Indicator) {
    this.indicators = [...this.indicators, indicator]
  }

  saveStrategies(strategy: Strategy) {
    this.strategies = [...this.strategies, strategy]
  }

}