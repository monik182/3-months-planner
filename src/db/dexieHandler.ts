import { DexiePlan, ParentProps, SyncQueueItem, UserPreferences } from '@/app/types/types'
import { db } from '@/db/dexie'
import { Goal, GoalHistory, Indicator, IndicatorHistory, Strategy, StrategyHistory, Notification, User, Waitlist } from '@/app/types/models'
import { Collection, Table } from 'dexie'

export const planHandler = {
  create: async (data: DexiePlan) => db.plans.add(data),
  createMany: async (data: DexiePlan[]) => db.plans.bulkAdd(data),
  findMany: async (where?: Partial<DexiePlan>) => db.plans.where(where ?? {}).toArray(),
  findOne: async (id: string) => db.plans.get(id),
  findAllByUserId: async (userId: string) => db.plans.where('userId').equals(userId).toArray(),
  findInProgress: async (userId: string) => db.plans.where({ userId, completed: 0 }).first(),
  findStarted: async (userId: string) => db.plans.where({ userId, completed: 0, started: 1 }).first(),
  update: async (id: string, data: Partial<DexiePlan>) => db.plans.update(id, data),
  delete: async (id: string) => db.plans.delete(id),
}

export const goalHandler = {
  create: async (data: Goal) => db.goals.add(data),
  createMany: async (data: Goal[]) => db.goals.bulkAdd(data),
  findMany: async (where: Partial<Goal> = {}, select?: Partial<Goal>) => {
    const goals = await getList<Goal>(db.goals, where).toArray()

    if (select) {
      return goals.map(goal => {
        const selectedGoal = {} as Goal
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
  findMany: async ({ status, planId }: ParentProps, where: Partial<GoalHistory> = {}) => {
    const goalHistories = await getList<GoalHistory>(db.goalHistory, where).toArray()

    const result = await Promise.all(
      goalHistories.map(async (goalHistory) => {
        const goal = await getList<Goal>(db.goals, { id: goalHistory.goalId, status, planId }).first()

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
  deleteMany: async (where: Partial<GoalHistory>) => db.goalHistory.where(where).delete(),
}

export const strategyHandler = {
  create: async (data: Strategy) => db.strategies.add(data),
  createMany: async (data: Strategy[]) => db.strategies.bulkAdd(data),
  findMany: async (where: Partial<Strategy> = {}, select?: Partial<Strategy>) => {
    const strategies = await getList<Strategy>(db.strategies, where).toArray()

    if (select) {
      return strategies.map(strategy => {
        const selectedStrategy = {} as Strategy
        for (const key in select) {
          if (select[key as keyof Strategy] && strategy[key as keyof Strategy] !== undefined) {
            (selectedStrategy as any)[key as keyof Strategy] = strategy[key as keyof Strategy]
          }
        }
        return selectedStrategy
      })
    }

    return strategies
  },
  findOne: async (id: string) => db.strategies.get(id),
  update: async (id: string, data: Partial<Strategy>) => db.strategies.update(id, data),
  delete: async (id: string) => db.strategies.delete(id),
}

export const strategyHistoryHandler = {
  create: async (data: StrategyHistory) => db.strategyHistory.add(data),
  createMany: async (data: StrategyHistory[]) => db.strategyHistory.bulkAdd(data),
  findMany: async ({ planId, goalId, status }: ParentProps, where: Partial<StrategyHistory> = {}, seq?: string) => {
    const strategyHistories = await getList<StrategyHistory>(db.strategyHistory, where).toArray()

    const result = await Promise.all(
      strategyHistories.map(async (strategyHistory) => {
        const strategy = await getList<Strategy>(db.strategies, { id: strategyHistory.strategyId, status, planId, goalId }).first()

        if (strategy && (!seq || strategy.weeks.includes(seq))) {
          return {
            ...strategyHistory,
            strategy: {
              content: strategy.content,
              weeks: strategy.weeks,
              goalId: strategy.goalId,
              frequency: strategy.frequency,
            },
          }
        }
        return null
      })
    )

    return result.filter((item) => item !== null)
  },
  findManyByGoalId: async ({ goalId, status }: ParentProps, where: Partial<StrategyHistory> = {}, seq?: string) => {
    const strategyHistories = await getList<StrategyHistory>(db.strategyHistory, where).toArray()

    const result = await Promise.all(
      strategyHistories.map(async (strategyHistory) => {
        const strategy = await getList<Strategy>(db.strategies, { id: strategyHistory.strategyId, status, goalId }).first()

        if (strategy && (!seq || strategy.weeks.includes(seq))) {
          return {
            ...strategyHistory,
            strategy: {
              content: strategy.content,
              weeks: strategy.weeks,
              frequency: strategy.frequency,
              goalId: strategy.goalId,
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
  deleteMany: async (where: Partial<StrategyHistory>) => db.strategyHistory.where(where).delete(),
}

export const indicatorHandler = {
  create: async (data: Indicator) => db.indicators.add(data),
  createMany: async (data: Indicator[]) => db.indicators.bulkAdd(data),
  findMany: async (where: Partial<Indicator> = {}, select?: Partial<Indicator>) => {
    const indicators = await getList<Indicator>(db.indicators, where).toArray()

    if (select) {
      return indicators.map(indicator => {
        const selectedIndicator = {} as Indicator
        for (const key in select) {
          if (select[key as keyof Indicator] && indicator[key as keyof Indicator] !== undefined) {
            (selectedIndicator as any)[key as keyof Indicator] = indicator[key as keyof Indicator]
          }
        }
        return selectedIndicator
      })
    }

    return indicators
  },
  findOne: async (id: string) => db.indicators.get(id),
  update: async (id: string, data: Partial<Indicator>) => db.indicators.update(id, data),
  delete: async (id: string) => db.indicators.delete(id),
}

export const indicatorHistoryHandler = {
  create: async (data: IndicatorHistory) => db.indicatorHistory.add(data),
  createMany: async (data: IndicatorHistory[]) => db.indicatorHistory.bulkAdd(data),
  findMany: async ({ planId, goalId, status }: ParentProps, where: Partial<IndicatorHistory> = {}) => {
    const indicatorHistories = await getList<IndicatorHistory>(db.indicatorHistory, where).toArray()

    const result = await Promise.all(
      indicatorHistories.map(async (indicatorHistory) => {
        const indicator = await getList<Indicator>(db.indicators, { id: indicatorHistory.indicatorId, goalId, planId, status }).first()

        if (indicator) {
          return {
            ...indicatorHistory,
            indicator: {
              content: indicator.content,
              initialValue: indicator.initialValue,
              goalValue: indicator.goalValue,
              metric: indicator.metric,
              goalId: indicator.goalId,
            },
          }
        }
        return null
      })
    )

    return result.filter((item) => item !== null)
  },
  findManyByGoalId: async ({ goalId, status }: ParentProps, where: Partial<IndicatorHistory> = {}) => {
    const indicatorHistories = await getList<IndicatorHistory>(db.indicatorHistory, where).toArray()

    const result = await Promise.all(
      indicatorHistories.map(async (indicatorHistory) => {
        const indicator = await getList<Indicator>(db.indicators, { id: indicatorHistory.indicatorId, goalId, status }).first()

        if (indicator) {
          return {
            ...indicatorHistory,
            indicator: {
              content: indicator.content,
              initialValue: indicator.initialValue,
              goalValue: indicator.goalValue,
              metric: indicator.metric,
              goalId: indicator.goalId,
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
  deleteMany: async (where: Partial<IndicatorHistory>) => db.indicatorHistory.where(where).delete(),
}

export const notificationHandler = {
  create: async (data: Notification) => db.notifications.add(data),
  findMany: async (where?: Partial<Notification>) => db.notifications.where(where ?? {}).toArray(),
  findOne: async (id: string) => db.notifications.get(id),
  update: async (id: string, data: Partial<Notification>) => db.notifications.update(id, data),
  delete: async (id: string) => db.notifications.delete(id),
}

export const userHandler = {
  create: async (data: User) => db.users.add(data),
  findOne: async (id: string) => db.users.get(id),
  findFirst: async () => db.users.where('id').notEqual('null').first(),
  findOneByEmail: async (email: string) => db.users.where('email').equals(email).first(),
  findOneByAuth0Id: async (auth0Id: string) => db.users.where('auth0Id').equals(auth0Id).first(),
  update: async (id: string, data: Partial<User>) => db.users.update(id, data),
  delete: async (id: string) => db.users.delete(id),
}

export const waitlistHandler = {
  create: async (data: Waitlist) => db.waitlist.add(data),
  findOne: async (id: string) => db.waitlist.get(id),
  getAll: async () => db.waitlist.toArray(),
  findFirst: async () => db.waitlist.where('id').notEqual('null').first(),
  findOneByToken: async (token: string) => db.waitlist.where('inviteToken').equals(token).first(),
  update: async (id: string, data: Partial<User>) => db.waitlist.update(id, data),
  delete: async (id: string) => db.waitlist.delete(id),
}

export const syncQueueHandler = {
  table: db.syncQueue,
  create: async (data: SyncQueueItem) => db.syncQueue.add(data),
  findOne: async (id: string) => db.syncQueue.get(id),
  getAll: async () => db.syncQueue.toArray(),
  findFirst: async () => db.syncQueue.where('id').notEqual('null').first(),
  findByStatus: async (status: string) => db.syncQueue.where('status').equals(status).toArray(),
  countByStatus: async (status: string) => db.syncQueue.where('status').equals(status).count(),
  update: async (id: string, data: Partial<SyncQueueItem>) => db.syncQueue.update(id, data),
  delete: async (id: string) => db.syncQueue.delete(id),
}

export const userPreferencesHandler = {
  create: async (data: UserPreferences) => db.userPreferences.add(data),
  findOne: async (id: string) => db.userPreferences.get(id),
  getAll: async () => db.userPreferences.toArray(),
  findFirst: async () => db.userPreferences.where('id').notEqual('null').first(),
  update: async (id: string, data: Partial<UserPreferences>) => db.userPreferences.update(id, data),
  delete: async (id: string) => db.userPreferences.delete(id),
}

export const clearDatabase = async () => {
  try {
    await Promise.all([
      db.plans.clear(),
      db.goals.clear(),
      db.goalHistory.clear(),
      db.strategies.clear(),
      db.strategyHistory.clear(),
      db.indicators.clear(),
      db.indicatorHistory.clear(),
      db.notifications.clear(),
      db.users.clear(),
      db.waitlist.clear(),
      db.syncQueue.clear(),
      db.userPreferences.clear(),
    ]);
    console.log("Database cleared.");
  } catch (error) {
    console.error("Failed to clear database:", error);
  }
}

function getList<T>(table: Table<T>): Table<T>
function getList<T>(table: Table<T>, where: Partial<T>): Collection<T>
function getList<T>(table: Table<T>, where: Partial<T> = {}): Table<T> | Collection<T> {
  let keys = Object.keys(where)
  for (const key of keys) {
    if (where[key as keyof T] == null) delete where[key as keyof T]
  }
  keys = Object.keys(where)

  if (keys.length) {
    return table.where(where)
  }
  return table
}
