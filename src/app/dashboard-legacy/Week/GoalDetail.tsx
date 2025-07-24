import { IndicatorDetail } from '@/app/dashboard-legacy/Week/IndicatorDetail'
import { StrategyDetail } from '@/app/dashboard-legacy/Week/StrategyDetail'
import { useDashboardContext } from '@/app/dashboard-legacy/dashboardContext'
import { GoalHistoryExtended } from '@/app/types/types'
import { calculateCompletionScore } from '@/app/util'
import { Card, Center, Spinner, Text } from '@chakra-ui/react'

interface GoalProps {
  goal: GoalHistoryExtended
  seq: number
}

export function GoalDetail({ goal, seq }: GoalProps) {
  const { isLoading, strategyHistoryActions, indicatorHistoryActions, getStrategiesByGoalId, getIndicatorsByGoalId } = useDashboardContext()
  const strategies = getStrategiesByGoalId(goal.goalId, seq.toString())
  const indicators = getIndicatorsByGoalId(goal.goalId, seq.toString())

  const updateStrategy = strategyHistoryActions.useUpdate()
  const updateIndicator = indicatorHistoryActions.useUpdate()
  const score = calculateCompletionScore(strategies.filter((strategy) => !!strategy.strategy.content))
  const isLoadingUpdate = updateStrategy.isPending

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    )
  }

  return (
    <Card.Root>
      <Card.Header className="flex flex-row justify-between">
        <Text fontSize="lg" fontWeight="bold">{goal.goal.content}</Text>
        <Text fontSize="xs">{isLoadingUpdate ? <Spinner size="xs" /> : score}/100%</Text>
      </Card.Header>
      <Card.Body className="flex gap-5">
        {strategies?.filter((strategy) => !!strategy.strategy.content).map((strategy) => (<StrategyDetail key={strategy.id} strategy={strategy} onChange={updateStrategy.mutate} />))}
      </Card.Body>
      <Card.Footer className="flex gap-5" alignItems="flex-end">
        {indicators?.map((indicator) => (<IndicatorDetail key={indicator.id} indicator={indicator} onChange={updateIndicator.mutate} />))}
      </Card.Footer>
    </Card.Root>
  )
}
