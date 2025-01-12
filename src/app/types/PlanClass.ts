import cuid from 'cuid'
import { Goal, Indicator, Plan, Status, Strategy } from '@/app/types'
import { calculatePlanEndDate, getDate, getPlanStartDate } from '@/app/util'
import { DEFAULT_WEEKS } from '@/app/constants'
import { goals, indicators, plans, strategies } from '@prisma/client'

export class PlanClass {
  private readonly userId: string
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
    const now = getDate()

    return {
      id: cuid(),
      userId: this.userId,
      vision: '',
      milestone: '',
      completed: false,
      startDate,
      endDate: calculatePlanEndDate(startDate),
      created: now,
      lastUpdate: now,
    }
  }

  private addItem<T extends { id: string }>(list: T[], item: T): T[] {
    if (list.find(i => i.id === item.id)) {
      return list
    }
    return [...list, item]
  }

  private updateItem<T extends { id: string }>(list: T[], id: string, updates: Partial<T>): T[] {
    return list.map(item => (item.id === id ? { ...item, ...updates } : item))
  }

  private removeItem<T extends { id: string }>(list: T[], id: string): T[] {
    return list.filter(item => item.id !== id)
  }

  public createGoal(content = '', status = Status.ACTIVE): Goal {
    const goal = {
      id: cuid(),
      planId: this.plan.id,
      content,
      status,
    }

    this.goals = this.addItem(this.goals, goal)
    return goal
  }

  public createStrategy(goalId: string, content = '', weeks = [...DEFAULT_WEEKS], status = Status.ACTIVE): Strategy {
    if (!this.goals.some(goal => goal.id === goalId)) {
      throw new Error(`Goal with id ${goalId} does not exist`)
    }
    const strategy = {
      id: cuid(),
      goalId,
      content,
      weeks,
      status,
    }

    this.strategies = this.addItem(this.strategies, strategy)
    return strategy
  }

  public createIndicator(
    goalId: string,
    content = '',
    metric = '',
    startingValue = 0,
    goalValue = 0,
    status = Status.ACTIVE
  ): Indicator {
    if (!this.goals.some(goal => goal.id === goalId)) {
      throw new Error(`Goal with id ${goalId} does not exist`)
    }

    const indicator = {
      id: cuid(),
      goalId,
      content,
      metric,
      startingValue,
      goalValue,
      status,
    }

    this.indicators = this.addItem(this.indicators, indicator)
    return indicator
  }

  public updatePlan(updates: Partial<Omit<Plan, 'id' | 'userId' | 'created'>>): void {
    this.plan = {
      ...this.plan,
      ...updates,
      lastUpdate: getDate(),
    }
  }

  public updateGoal(id: string, updates: Partial<Goal>): void {
    this.goals = this.updateItem(this.goals, id, updates)
  }

  public updateStrategy(id: string, updates: Partial<Strategy>): void {
    this.strategies = this.updateItem(this.strategies, id, updates)
  }

  public updateIndicator(id: string, updates: Partial<Indicator>): void {
    this.indicators = this.updateItem(this.indicators, id, updates)
  }

  public removeGoal(id: string): void {
    this.goals = this.removeItem(this.goals, id)
    this.strategies = this.strategies.filter(strategy => strategy.goalId !== id)
    this.indicators = this.indicators.filter(indicator => indicator.goalId !== id)
  }

  public removeStrategy(id: string): void {
    this.strategies = this.removeItem(this.strategies, id)
  }

  public removeIndicator(id: string): void {
    this.indicators = this.removeItem(this.indicators, id)
  }

  public getPlan(): Plan {
    return { ...this.plan }
  }

  public getGoals(): Goal[] {
    return [...this.goals]
  }

  public getStrategies(): Strategy[] {
    return [...this.strategies]
  }

  public getIndicators(): Indicator[] {
    return [...this.indicators]
  }

  public planToPrismaType(): plans {
    return {
      id: this.plan.id,
      user_id: this.userId,
      vision: this.plan.vision,
      milestone: this.plan.milestone,
      completed: this.plan.completed,
      start_date: new Date(this.plan.startDate),
      end_date: new Date(this.plan.endDate),
      created: new Date(this.plan.created),
      last_update: new Date(this.plan.lastUpdate),
    }
  }

  public goalsToPrismaType(): goals[] {
    return this.goals.filter(g => g.content.length > 0).map((goal) => ({
      id: goal.id,
      plan_id: goal.planId,
      content: goal.content,
      status: goal.status,
    }))
  }

  public strategiesToPrismaType(): strategies[] {
    return this.strategies.filter(s => s.content.length > 0).map((strategy) => ({
      id: strategy.id,
      goal_id: strategy.goalId,
      content: strategy.content,
      status: strategy.status,
      weeks: strategy.weeks.join(','),
    }))
  }

  public indicatorsToPrismaType(): indicators[] {
    return this.indicators.filter(i => i.content.length > 0).map((indicators) => ({
      id: indicators.id,
      goal_id: indicators.goalId,
      content: indicators.content,
      status: indicators.status,
      metric: indicators.metric,
      starting_value: parseInt(indicators.startingValue + ''),
      goal_value: parseInt(indicators.goalValue + ''),
    }))
  }

}
