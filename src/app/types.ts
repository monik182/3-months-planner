export interface Strategy {
  id: string
  value: string
  weeks: string[]
  isEditing: boolean
}

export interface Indicator {
  value: string
  startingNumber: number | null
  goalNumber: number | null
  metric: string
  isEditing: boolean
}

export interface Goal {
  id: string
  value: string
  isEditingWeeks: boolean
  strategies: Strategy[]
  indicators: Indicator[]
}

export interface Vision {
  content: string
}

export interface Step<T> {
  goNext?: () => void
  onChange: (value: T) => void
}

export interface Plan {
  vision: string
  threeYearMilestone: string
  goals: Goal[]
  startDate: string
  endDate: string
}
