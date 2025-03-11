import { DexiePlan, SyncQueueItem, UserPreferences } from '@/app/types/types'
import { Goal, GoalHistory, Indicator, IndicatorHistory, Strategy, StrategyHistory, Notification, User, Waitlist } from '@prisma/client'
import Dexie, { Table } from 'dexie'

class IdxDB extends Dexie {
  plans!: Table<DexiePlan>
  goals!: Table<Goal>
  goalHistory!: Table<GoalHistory>
  strategies!: Table<Strategy>
  strategyHistory!: Table<StrategyHistory>
  indicators!: Table<Indicator>
  indicatorHistory!: Table<IndicatorHistory>
  notifications!: Table<Notification>
  users!: Table<User>
  waitlist!: Table<Waitlist>
  syncQueue!: Table<SyncQueueItem>
  userPreferences!: Table<UserPreferences>

  constructor() {
    super('LocalDB')
    this.version(3.2).stores({
      plans: 'id, userId, completed, started, [userId+completed]',
      goals: 'id, planId, status, [id+status+planId], [planId+status], [id+planId]',
      goalHistory: 'id, goalId, planId, sequence',
      strategies: 'id, goalId, planId, status, weeks, [id+goalId+status], [id+status+planId], [planId+status], [goalId+status], [id+planId]',
      strategyHistory: 'id, strategyId, planId, sequence',
      indicators: 'id, goalId, planId, [id+goalId+status], [id+planId], [planId+status], [goalId+status], [id+planId+status]',
      indicatorHistory: 'id, indicatorId, planId, value, sequence',
      notifications: 'id, userId, planId',
      users: 'id, email, waitlistId, role, auth0Id',
      waitlist: 'id, inviteToken, email, position',
      syncQueue: '++id, entityType, entityId, operation, status, timestamp',
      userPreferences: 'userId, hasSynced, lastSyncTime',
    })
  }
}

export const db = new IdxDB()
