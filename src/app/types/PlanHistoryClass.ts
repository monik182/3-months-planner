import cuid from 'cuid'
import { Goal, GoalHistory, Indicator, IndicatorHistory, Plan, Strategy, StrategyHistory } from '@/app/types'
import { DEFAULT_WEEKS } from '@/app/constants'
import { calculateWeekEndDate, calculateWeekStartDate } from '@/app/util'
import { goal_history, indicator_history, strategy_history } from '@prisma/client'

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
        return this.createGoalHistory(goal.id, startDate, endDate, sequence)
      })
    }).flat()
  }

  private createGoalHistory(goalId: string, startDate: string, endDate: string, sequence: number): GoalHistory {
    return {
      id: cuid(),
      goalId,
      startDate,
      endDate,
      sequence,
    }
  }

  private createStrategyHistoryList(strategies: Strategy[]): StrategyHistory[] {
    return strategies.map((strategy) => {
      return DEFAULT_WEEKS.map((week) => {
        const sequence = parseInt(week)
        return this.createStrategyHistory(strategy.id, sequence)
      })
    }).flat()
  }

  private createStrategyHistory(strategyId: string, sequence: number): StrategyHistory {
    return {
      id: cuid(),
      strategyId,
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
        return this.createIndicatorHistory(indicator.id, sequence)
      })
    }).flat()
  }

  private createIndicatorHistory(indicatorId: string, sequence: number): IndicatorHistory {
    return {
      id: cuid(),
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

  public goalsToPrismaType(): goal_history[] {
    return this.goals.map((goal) => ({
      id: goal.id,
      goal_id: goal.goalId,
      start_date: new Date(goal.startDate),
      end_date: new Date(goal.endDate),
      sequence: goal.sequence,
    }))
  }

  public strategiesToPrismaType(): strategy_history[] {
    return this.strategies.map((strategy) => ({
      id: strategy.id,
      strategy_id: strategy.strategyId,
      overdue: strategy.overdue,
      completed: strategy.completed,
      first_update: strategy.firstUpdate ? new Date(strategy.firstUpdate) : null,
      last_update: strategy.lastUpdate ? new Date(strategy.lastUpdate) : null,
      sequence: strategy.sequence,
    }))
  }

  public indicatorsToPrismaType(): indicator_history[] {
    return this.indicators.map((indicators) => ({
      id: indicators.id,
      indicator_id: indicators.indicatorId,
      value: indicators.value,
      sequence: indicators.sequence,
    }))
  }

}
