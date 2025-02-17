import { DixiePlan } from '@/app/types/types'
import { Goal, GoalHistory, Indicator, IndicatorHistory, Strategy, StrategyHistory, Notification, User } from '@prisma/client'
import Dexie, { Table } from 'dexie'

class IdxDB extends Dexie {
  plans!: Table<DixiePlan>
  goals!: Table<Goal>
  goalHistory!: Table<GoalHistory>
  strategies!: Table<Strategy>
  strategyHistory!: Table<StrategyHistory>
  indicators!: Table<Indicator>
  indicatorHistory!: Table<IndicatorHistory>
  notifications!: Table<Notification>
  users!: Table<User>

  constructor() {
    super('LocalDB')
    this.version(2.1).stores({
      plans: 'id, userId, completed, started',
      goals: 'id, planId, status',
      goalHistory: 'id, goalId, planId, sequence',
      strategies: 'id, goalId, planId, status, weeks',
      strategyHistory: 'id, strategyId, planId, sequence',
      indicators: 'id, goalId, planId',
      indicatorHistory: 'id, indicatorId, planId, value, sequence',
      notifications: 'id, userId, planId',
      users: 'id, email, waitlistId, role',
    })
  }
}

export const db = new IdxDB()
