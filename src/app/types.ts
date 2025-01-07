export interface Strategy {
  id: string
  content: string
  weeks: string[]
  isEditing?: boolean
}

export interface Indicator {
  id: string
  content: string
  startingNumber: number | null
  goalNumber: number | null
  metric: string
  isEditing: boolean
}

export interface Goal {
  id: string
  content: string
  isEditingWeeks?: boolean
  strategies: Strategy[]
  indicators: Indicator[]
}

export interface Vision {
  content: string
}

export interface Plan {
  id: string
  vision: string
  threeYearMilestone: string
  goals: Goal[]
  startDate: string
  endDate: string
  completed: boolean
  created: string
  lastUpdated: string
}

export interface IndicatorTracking extends Indicator {
  weekId: string
  trend: number
  value: number
}

export interface StrategyTracking extends Strategy {
  weekId: string
  checked: boolean
  firstUpdated: string
  lastUpdated: string
  overdue: boolean
}

export interface GoalTracking extends Goal {
  weekId: string
  score: number
  strategies: StrategyTracking[]
  indicators: IndicatorTracking[]
}

export interface WeekTracking {
  id: string
  startDate: string
  endDate: string
  weekNumber: number
  score: number
  goals: GoalTracking[]
}

export interface PlanTracking extends Plan {
  id: string
  weeks: WeekTracking[]
}

export interface Step<T> {
  goNext?: () => void
  onChange: (value: T) => void
}
