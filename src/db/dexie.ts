import { DixiePlan } from '@/app/types/types'
import { Goal, GoalHistory, Indicator, IndicatorHistory, Strategy, StrategyHistory, Notification, User, Waitlist } from '@prisma/client'
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
  waitlist!: Table<Waitlist>

  constructor() {
    super('LocalDB')
    this.version(2.5).stores({
      plans: 'id, userId, completed, started, [userId+completed]',
      goals: 'id, planId, status, [id+status+planId]',
      goalHistory: 'id, goalId, planId, sequence',
      strategies: 'id, goalId, planId, status, weeks, [id+goalId+status], [id+status+planId]',
      strategyHistory: 'id, strategyId, planId, sequence',
      indicators: 'id, goalId, planId, [id+goalId+status], [id+planId]',
      indicatorHistory: 'id, indicatorId, planId, value, sequence',
      notifications: 'id, userId, planId',
      users: 'id, email, waitlistId, role, auth0Id',
      waitlist: 'id, inviteToken, email, position',
    })
  }
}

export const db = new IdxDB()
