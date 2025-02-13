import { DixiePlan, ParentProps } from '@/app/types/types'
import { db } from '@/db/dexie'
import { Goal, GoalHistory, Indicator, IndicatorHistory, Strategy, StrategyHistory, Notification } from '@prisma/client'

export const planHandler = {
  create: async (data: DixiePlan) => db.plans.add(data),
  findMany: async (where?: Partial<DixiePlan>) => db.plans.where(where ?? {}).toArray(),
  findOne: async (id: string) => db.plans.get(id),
  findInProgress: async (userId: string) => db.plans.where({ userId, completed: 0 }).first(),
  findStarted: async (userId: string) => db.plans.where({ userId, completed: 0, started: 1 }).first(),
  update: async (id: string, data: Partial<DixiePlan>) => db.plans.update(id, data),
  delete: async (id: string) => db.plans.delete(id),
}

export const goalHandler = {
  create: async (data: Goal) => db.goals.add(data),
  createMany: async (data: Goal[]) => db.goals.bulkAdd(data),
  findMany: async (where?: Partial<Goal>, select?: Partial<Goal>) => {
    const goals = await db.goals.where(where ?? {}).toArray()

    if (select) {
      return goals.map(goal => {
        const selectedGoal: Partial<Goal> = {}
        for (const key in select) {
          if (select[key as keyof Goal] && goal[key as keyof Goal] !== undefined) {
            selectedGoal[key as keyof Goal] = goal[key as keyof Goal]
          }
        }
        return selectedGoal
      })
    }

    return goals
  },
  findOne: async (id: string) => db.goals.get(id),
  update: async (id: string, data: Partial<Goal>) => db.goals.update(id, data),
  delete: async (id: string) => db.goals.delete(id),
}

export const goalHistoryHandler = {
  create: async (data: GoalHistory) => db.goalHistory.add(data),
  createMany: async (data: GoalHistory[]) => db.goalHistory.bulkAdd(data),
  findMany: async ({ status, planId }: ParentProps, where?: Partial<GoalHistory>) => {
    const goalHistories = await db.goalHistory.where(where ?? {}).toArray()

    const result = await Promise.all(
      goalHistories.map(async (goalHistory) => {
        const goal = await db.goals
          .where({ id: goalHistory.goalId, status, planId })
          .first()

        if (goal) {
          return {
            ...goalHistory,
            goal: {
              content: goal.content,
            },
          }
        }
        return null
      })
    )

    return result.filter((item) => item !== null)
  },
  findOne: async (id: string) => db.goalHistory.get(id),
  update: async (id: string, data: Partial<GoalHistory>) => db.goalHistory.update(id, data),
  delete: async (id: string) => db.goalHistory.delete(id),
}

export const strategyHandler = {
  create: async (data: Strategy) => db.strategies.add(data),
  createMany: async (data: Strategy[]) => db.strategies.bulkAdd(data),
  findMany: async (where?: Partial<Strategy>) => db.strategies.where(where ?? {}).toArray(),
  findOne: async (id: string) => db.strategies.get(id),
  update: async (id: string, data: Partial<Strategy>) => db.strategies.update(id, data),
  delete: async (id: string) => db.strategies.delete(id),
}

export const strategyHistoryHandler = {
  create: async (data: StrategyHistory) => db.strategyHistory.add(data),
  createMany: async (data: StrategyHistory[]) => db.strategyHistory.bulkAdd(data),
  findMany: async ({ planId, goalId, status }: ParentProps, where?: Partial<StrategyHistory>, seq?: string) => {
    const strategyHistories = await db.strategyHistory.where(where ?? {}).toArray()

    const result = await Promise.all(
      strategyHistories.map(async (strategyHistory) => {
        const strategy = await db.strategies
          .where({ id: strategyHistory.strategyId, status, planId, goalId })
          .first()

        if (strategy && (!seq || strategy.weeks.includes(seq))) {
          return {
            ...strategyHistory,
            strategy: {
              content: strategy.content,
              weeks: strategy.weeks,
            },
          }
        }
        return null
      })
    )

    return result.filter((item) => item !== null)
  },
  findManyByGoalId: async ({ goalId, status }: ParentProps, where?: Partial<StrategyHistory>, seq?: string) => {
    const strategyHistories = await db.strategyHistory.where(where ?? {}).toArray()

    const result = await Promise.all(
      strategyHistories.map(async (strategyHistory) => {
        const strategy = await db.strategies
          .where({ id: strategyHistory.strategyId, goalId, status })
          .first()

        if (strategy && (!seq || strategy.weeks.includes(seq))) {
          return {
            ...strategyHistory,
            strategy: {
              content: strategy.content,
              weeks: strategy.weeks,
              frequency: strategy.frequency,
            },
          }
        }
        return null
      })
    )

    return result.filter((item) => item !== null)
  },
  findOne: async (id: string) => db.strategyHistory.get(id),
  update: async (id: string, data: Partial<StrategyHistory>) => db.strategyHistory.update(id, data),
  delete: async (id: string) => db.strategyHistory.delete(id),
}

export const indicatorHandler = {
  create: async (data: Indicator) => db.indicators.add(data),
  createMany: async (data: Indicator[]) => db.indicators.bulkAdd(data),
  findMany: async (where?: Partial<Indicator>) => db.indicators.where(where ?? {}).toArray(),
  findOne: async (id: string) => db.indicators.get(id),
  update: async (id: string, data: Partial<Indicator>) => db.indicators.update(id, data),
  delete: async (id: string) => db.indicators.delete(id),
}

export const indicatorHistoryHandler = {
  create: async (data: IndicatorHistory) => db.indicatorHistory.add(data),
  createMany: async (data: IndicatorHistory[]) => db.indicatorHistory.bulkAdd(data),
  findMany: async ({ planId, goalId, status }: ParentProps, where?: Partial<IndicatorHistory>) => {
    const indicatorHistories = await db.indicatorHistory.where(where ?? {}).toArray()

    const result = await Promise.all(
      indicatorHistories.map(async (indicatorHistory) => {
        const indicator = await db.indicators.where({ id: indicatorHistory.indicatorId, goalId, planId, status }).first()

        if (indicator) {
          return {
            ...indicatorHistory,
            indicator: {
              content: indicator.content,
              initialValue: indicator.initialValue,
              goalValue: indicator.goalValue,
              metric: indicator.metric,
            },
          }
        }
        return null
      })
    )

    return result.filter((item) => item !== null)
  },
  findManyByGoalId: async ({ goalId, status }: ParentProps, where?: Partial<IndicatorHistory>) => {
    const indicatorHistories = await db.indicatorHistory.where(where ?? {}).toArray()

    const result = await Promise.all(
      indicatorHistories.map(async (indicatorHistory) => {
        const indicator = await db.indicators
          .where({ id: indicatorHistory.indicatorId, goalId, status })
          .first()

        if (indicator) {
          return {
            ...indicatorHistory,
            indicator: {
              content: indicator.content,
              initialValue: indicator.initialValue,
              goalValue: indicator.goalValue,
              metric: indicator.metric,
            },
          }
        }
        return null
      })
    )

    return result.filter((item) => item !== null)
  },
  findOne: async (id: string) => db.indicatorHistory.get(id),
  update: async (id: string, data: Partial<IndicatorHistory>) => db.indicatorHistory.update(id, data),
  delete: async (id: string) => db.indicatorHistory.delete(id),
}

export const notificationHandler = {
  create: async (data: Notification) => db.notifications.add(data),
  findMany: async (where?: Partial<Notification>) => db.notifications.where(where ?? {}).toArray(),
  findOne: async (id: string) => db.notifications.get(id),
  update: async (id: string, data: Partial<Notification>) => db.notifications.update(id, data),
  delete: async (id: string) => db.notifications.delete(id),
}
