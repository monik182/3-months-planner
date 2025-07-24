export type Goal = {
  id: string
  content: string
  strategies: Strategy[]
}

export type Strategy = {
  id: string
  content: string
  frequency: number
  goalId: string
}

export type StrategyHistory = {
  strategyId: string
  sequence: number
  completed: boolean
}

export interface TrackerData {
  goals: Goal[]
  history: StrategyHistory[]
}
