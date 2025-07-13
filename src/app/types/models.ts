export enum Role {
  GUEST = 'GUEST',
  USER = 'USER',
  SUBSCRIBER = 'SUBSCRIBER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  TRIAL = 'TRIAL',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  PAUSED = 'PAUSED',
  PENDING = 'PENDING',
  GRACE_PERIOD = 'GRACE_PERIOD',
  RENEWAL_DUE = 'RENEWAL_DUE',
  FAILED = 'FAILED',
  UPCOMING = 'UPCOMING',
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
}

export interface Plan {
  id: string
  userId: string
  vision: string
  milestone: string
  completed: boolean
  started: boolean
  startDate: Date
  endDate: Date
  created: Date
  lastUpdate: Date
}

export interface Goal {
  id: string
  planId: string
  content: string
  status: string
}

export interface GoalHistory {
  id: string
  goalId: string
  planId: string
  sequence: number
}

export interface Strategy {
  id: string
  goalId: string
  planId: string
  content: string
  weeks: string[]
  status: string
  frequency: number
}

export interface StrategyHistory {
  id: string
  strategyId: string
  planId: string
  overdue: boolean
  completed: boolean
  firstUpdate: Date | null
  lastUpdate: Date | null
  sequence: number
  frequencies: boolean[]
}

export interface Indicator {
  id: string
  goalId: string
  planId: string
  content: string
  metric: string
  initialValue: number
  goalValue: number
  status: string
}

export interface IndicatorHistory {
  id: string
  indicatorId: string
  planId: string
  value: number
  sequence: number
}

export interface Notification {
  id: string
  userId: string
  planId: string
  entityType: string
  entityId: string
  type: string
  message: string
  status: string
  sendDate: Date
  created: Date
  lastUpdate: Date
}

export interface Waitlist {
  id: string
  email: string
  name?: string | null
  position: number
  invited: boolean
  inviteToken?: string | null
  invitedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Feedback {
  id: string
  userId?: string | null
  email?: string | null
  feedback: string
  createdAt: Date
}

export interface User {
  id: string
  auth0Id?: string | null
  email: string
  role: Role
  waitlistId?: string | null
  createdAt: Date
}

export interface Subscription {
  id: string
  userId: string
  status: SubscriptionStatus
  plan: SubscriptionPlan
  startedAt: Date
  expiresAt?: Date | null
  renewalDate?: Date | null
  canceledAt?: Date | null
  trialEndsAt?: Date | null
  createdAt: Date
  updatedAt: Date
}
