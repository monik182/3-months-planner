import { usePlanContext } from '@/app/providers/usePlanContext'
import { Goal } from '@prisma/client'

interface GoalProps {
  goal: Goal
  seq: number
}

export function GoalComponent({ goal, seq }: GoalProps) {
  const { strategyHistoryActions, indicatorHistoryActions } = usePlanContext()
  const { data: strategies = [], isLoading: isLoadingStrategies } = strategyHistoryActions.useGetByGoalId(goal.id, seq + '')
  const { data: indicators = [], isLoading: isLoadingIndicators } = indicatorHistoryActions.useGetByGoalId(goal.id, seq + '')

  const isLoading = isLoadingStrategies || isLoadingIndicators

  if (isLoading) {
    return (
      <div>
        Is loading strategies and indicators...
      </div>
    )
  }

  return (
    <div>
      <p>Week score #</p>
      <strong>Goal</strong> {goal.content}
      {strategies.map(s => (<div key={s.id}>{s.strategy.content}</div>))}
      --------------
      {indicators.map(s => (<div key={s.id}>{s.indicator.content}</div>))}
      --------------
    </div>
  )
}