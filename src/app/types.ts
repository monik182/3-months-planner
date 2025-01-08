export interface Plan {
  id: string
  vision: string
  threeYearMilestone: string
  completed: boolean
  startDate: string
  endDate: string | null
  created: string
  lastUpdated: string
  goals: Goal[]
  weeks: Week[]
}

export interface Week {
  id: string
  startDate: string | null
  endDate: string | null
  weekNumber: number
  score: number
  goals: Goal[]
}

export interface Goal {
  id: string
  weekId: string
  score: number
  content: string
  isEditingWeeks?: boolean
  strategies: Strategy[]
  indicators: Indicator[]
}

export interface Strategy {
  id: string
  weekId: string
  content: string
  weeks: string[]
  isEditing?: boolean // TODO: Remove this
  overdue: boolean
  checked: boolean
  firstUpdated: string | null
  lastUpdated: string | null
}

export interface Indicator {
  id: string
  content: string
  startingNumber: number | null
  goalNumber: number | null
  metric: string
  isEditing?: boolean // TODO: Remove this
  weekId: string
  trend: number
  value: number
}

export interface Step<T> {
  goNext?: () => void
  onChange: (value: T) => void
}

export interface Vision {
  content: string
}
