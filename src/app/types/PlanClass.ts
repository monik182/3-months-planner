import { v4 as uuidv4 } from 'uuid'
import { Goal, Indicator, Plan, Status, Strategy } from '@/app/types'
import { calculatePlanEndDate, getDate, getPlanStartDate } from '@/app/util'
import { DEFAULT_WEEKS } from '@/app/constants'

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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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

  // public saveGoal(goal: Goal): void {
  //   this.goals = this.addItem(this.goals, goal)
  // }

  // public saveIndicator(indicator: Indicator): void {
  //   this.indicators = this.addItem(this.indicators, indicator)
  // }

  // public saveStrategy(strategy: Strategy): void {
  //   this.strategies = this.addItem(this.strategies, strategy)
  // }

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
}
