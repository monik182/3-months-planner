export interface Plan {
  id: string
  userId: string
  vision: string
  milestone: string
  completed: boolean
  startDate: string
  endDate: string
  created: string
  lastUpdate: string
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
  startDate: string
  endDate: string
  sequence: number
}

export interface Strategy {
  id: string
  goalId: string
  content: string
  weeks: string[]
  status: string
}

export interface StrategyHistory {
  id: string
  strategyId: string
  overdue: boolean
  completed: boolean
  firstUpdate: string | null
  lastUpdate: string | null
  sequence: number
}

export interface Indicator {
  id: string
  goalId: string
  content: string
  metric: string
  startingValue: number
  goalValue: number
  status: string
}

export interface IndicatorHistory {
  id: string
  indicatorId: string
  value: number
  sequence: number
}

// FIXME: will this be the final enums?
export enum Status {
  INACTIVE = '0',
  ACTIVE = '1',
  DELETED = '2',
}

export interface Step<T> {
  goNext?: () => void
  onChange?: (value: T) => void
}

export interface Vision {
  content: string
}
