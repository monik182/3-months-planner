import { Goal, GoalHistory, Indicator, IndicatorHistory, Strategy, StrategyHistory } from '@prisma/client'

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

export interface SegmentData {
  params: Promise<{
    id: string
  }>
}

export interface GoalHistoryExtended extends GoalHistory {
  goal: Pick<Goal, 'content'>
}

export interface StrategyHistoryExtended extends StrategyHistory {
  strategy: Pick<Strategy, 'content' | 'weeks'>
}

export interface IndicatorHistoryExtended extends IndicatorHistory {
  indicator: Pick<Indicator, 'content' | 'metric' | 'startingValue' | 'goalValue'>
}
