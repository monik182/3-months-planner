import { v4 as uuidv4 } from 'uuid'
import { Goal, GoalHistory, Indicator, IndicatorHistory, Plan, Status, Strategy, StrategyHistory } from '@/app/types'
import { calculatePlanEndDate, getDate, getPlanStartDate } from '@/app/util'
import { DEFAULT_WEEKS } from '@/app/constants'

export class PlanHistoryClass {
  private userId: string
  private plan: Plan
  private goals: Goal[] = []
  private strategies: Strategy[] = []
  private indicators: Indicator[] = []
  private goalHistory: GoalHistory[] = []
  private strategyHistory: StrategyHistory[] = []
  private indicatorHistory: IndicatorHistory[] = []

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

  private createGoalHistory(goalId: string, startDate: string, endDate: string, sequence: number): GoalHistory {
    return {
      id: uuidv4(),
      goalId,
      startDate,
      endDate,
      sequence,
    }
  }

  private createStrategyHistory(strategyId: string, sequence: number): StrategyHistory {
    return {
      id: uuidv4(),
      strategyId,
      overdue: false,
      completed: false,
      firstUpdate: null,
      lastUpdate: null,
      sequence,
    }
  }

  private createIndicatorHistory(indicatorId: string, sequence: number): IndicatorHistory {
    return {
      id: uuidv4(),
      indicatorId,
      value: 0,
      sequence,
    }
  }

  createTrackingPlan() {

  }

}