export interface Plan {
  id: string
  userId: string
  vision: string
  milestone: string
  completed: boolean
  startDate: string
  endDate: string
  created: string
  lastUpdated: string
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
}

export interface Indicator {
  id: string
  goalId: string
  content: string
  metric: string
  startingValue: number
  goalNumber: number
  status: string
}

export interface IndicatorHistory {
  id: string
  indicatorId: string
  value: number
}

export interface Step<T> {
  goNext?: () => void
  onChange: (value: T) => void
}

export interface Vision {
  content: string
}
