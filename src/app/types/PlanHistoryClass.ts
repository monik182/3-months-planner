import cuid from 'cuid'
import { DEFAULT_WEEKS } from '@/app/constants'
import { calculateWeekEndDate, calculateWeekStartDate } from '@/app/util'
import { Goal, GoalHistory, Indicator, IndicatorHistory, Plan, Strategy, StrategyHistory } from '@prisma/client'

export class PlanHistoryClass {
  private plan: Plan
  private goals: GoalHistory[] = []
  private strategies: StrategyHistory[] = []
  private indicators: IndicatorHistory[] = []

  constructor(plan: Plan, goals: Goal[], strategies: Strategy[], indicators: Indicator[]) {
    this.plan = { ...plan }
    this.goals = this.createGoalHistoryList(goals)
    this.strategies = this.createStrategyHistoryList(strategies)
    this.indicators = this.createIndicatorHistoryList(indicators)
  }

  private updateItem<T extends { id: string }>(list: T[], id: string, updates: Partial<T>): T[] {
    return list.map(item => (item.id === id ? { ...item, ...updates } : item))
  }

  private createGoalHistoryList(goals: Goal[]): GoalHistory[] {
    return goals.map((goal) => {
      return DEFAULT_WEEKS.map((week) => {
        const sequence = parseInt(week)
        const startDate = calculateWeekStartDate(this.plan.startDate, sequence)
        const endDate = calculateWeekEndDate(startDate)
        return this.createGoalHistory(goal.id, goal.planId, startDate, endDate, sequence)
      })
    }).flat()
  }

  private createGoalHistory(goalId: string, planId: string, startDate: Date, endDate: Date, sequence: number): GoalHistory {
    return {
      id: cuid(),
      goalId,
      planId,
      startDate,
      endDate,
      sequence,
    }
  }

  private createStrategyHistoryList(strategies: Strategy[]): StrategyHistory[] {
    return strategies.map((strategy) => {
      return DEFAULT_WEEKS.map((week) => {
        const sequence = parseInt(week)
        return this.createStrategyHistory(strategy.id, strategy.planId, sequence)
      })
    }).flat()
  }

  private createStrategyHistory(strategyId: string, planId: string, sequence: number): StrategyHistory {
    return {
      id: cuid(),
      strategyId,
      planId,
      overdue: false,
      completed: false,
      firstUpdate: null,
      lastUpdate: null,
      sequence,
    }
  }

  private createIndicatorHistoryList(indicators: Indicator[]): IndicatorHistory[] {
    return indicators.map((indicator) => {
      return DEFAULT_WEEKS.map((week) => {
        const sequence = parseInt(week)
        return this.createIndicatorHistory(indicator.id, indicator.planId, sequence)
      })
    }).flat()
  }

  private createIndicatorHistory(indicatorId: string, planId: string, sequence: number): IndicatorHistory {
    return {
      id: cuid(),
      planId,
      indicatorId,
      value: 0,
      sequence,
    }
  }

  public updateStrategy(id: string, updates: Partial<StrategyHistory>): void {
    this.strategies = this.updateItem(this.strategies, id, updates)
  }

  public updateIndicator(id: string, updates: Partial<IndicatorHistory>): void {
    this.indicators = this.updateItem(this.indicators, id, updates)
  }

  public getGoals(): GoalHistory[] {
    return [...this.goals]
  }

  public getStrategies(): StrategyHistory[] {
    return [...this.strategies]
  }

  public getIndicators(): IndicatorHistory[] {
    return [...this.indicators]
  }

}
