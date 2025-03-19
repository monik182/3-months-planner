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
  onChange?: (value?: T) => void
  onEdit?: (entityType: EntityType, entity: any) => void
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

export enum QueueOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum QueueStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  FAILED = 'failed',
  COMPLETED = 'completed',
}

export enum QueueEntityType {
  USER = 'user',
  PLAN = 'plan',
  GOAL = 'goal',
  GOAL_BULK = 'goalBulk',
  GOAL_HISTORY = 'goalHistory',
  GOAL_HISTORY_BULK = 'goalHistoryBulk',
  STRATEGY = 'strategy',
  STRATEGY_BULK = 'strategyBulk',
  STRATEGY_HISTORY = 'strategyHistory',
  STRATEGY_HISTORY_BULK = 'strategyHistoryBulk',
  INDICATOR = 'indicator',
  INDICATOR_BULK = 'indicatorBulk',
  INDICATOR_HISTORY = 'indicatorHistory',
  INDICATOR_HISTORY_BULK = 'indicatorHistoryBulk',
}

export interface SyncQueueItem {
  id?: number
  entityType: QueueEntityType
  entityId: string
  operation: QueueOperation
  payload: any
  status: QueueStatus
  attempts: number
  timestamp: number
  error?: string
}

export interface SyncStatus {
  pending: number
  processing: number
  failed: number
  total: number
}

export interface UserPreferences {
  userId: string
  hasSynced: boolean
  lastSyncTime?: number
}
