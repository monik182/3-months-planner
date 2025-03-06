import { UserProfile } from '@auth0/nextjs-auth0/client'
import { Goal, GoalHistory, Indicator, IndicatorHistory, Plan, Strategy, StrategyHistory, User } from '@prisma/client'

// FIXME: will this be the final enums?
export enum Status {
  INACTIVE = '0',
  ACTIVE = '1',
  DELETED = '2',
}

export interface Step<T> {
  onLoading?: (loading: boolean) => void
  onChange?: (value: T) => void
}

export interface Vision {
  content: string
}

export interface SegmentData {
  params: Promise<{
    id: string
  }>
}

export interface GoalHistoryExtended extends GoalHistory {
  goal: Pick<Goal, 'content'>
}

export interface StrategyHistoryExtended extends StrategyHistory {
  strategy: Pick<Strategy, 'content' | 'weeks' | 'frequency' | 'goalId'>
}

export interface IndicatorHistoryExtended extends IndicatorHistory {
  indicator: Pick<Indicator, 'content' | 'metric' | 'initialValue' | 'goalValue' | 'goalId'>
}

export enum EntityType {
  Goal = 'goal',
  Strategy = 'strategy',
  Indicator = 'Indicator'
}

export interface DexiePlan extends Omit<Plan, 'completed' | 'started'> {
  completed: number
  started: number
}

export interface ParentProps {
  planId?: string
  goalId?: string
  status?: string
}

export type UserExtended = User & Pick<UserProfile, 'sub' | 'picture'>

export interface SyncQueueItem {
  id?: number
  entityType: string
  entityId: string
  operation: 'create' | 'update' | 'delete'
  payload: any
  status: 'pending' | 'processing' | 'failed' | 'completed'
  attempts: number
  timestamp: number
  error?: string
}

export interface UserPreferences {
  userId: string
  hasSynced: boolean
  lastSyncTime?: number
}
