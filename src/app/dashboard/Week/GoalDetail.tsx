import { IndicatorDetail } from '@/app/dashboard/Week/IndicatorDetail'
import { StrategyDetail } from '@/app/dashboard/Week/StrategyDetail'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { GoalHistoryExtended } from '@/app/types/types'
import { calculateCompletionScore } from '@/app/util'
import { Card, Center, Spinner, Text } from '@chakra-ui/react'

interface GoalProps {
  goal: GoalHistoryExtended
  seq: number
}

export function GoalDetail({ goal, seq }: GoalProps) {
  const { strategyHistoryActions, indicatorHistoryActions } = usePlanContext()
  const { data: strategies = [], isLoading: isLoadingStrategies, isRefetching } = strategyHistoryActions.useGetByGoalId(goal.goalId, seq + '')
  const { data: indicators = [], isLoading: isLoadingIndicators } = indicatorHistoryActions.useGetByGoalId(goal.goalId, seq + '')

  const updateStrategy = strategyHistoryActions.useUpdate()
  const updateIndicator = indicatorHistoryActions.useUpdate()
  const score = calculateCompletionScore(strategies)

  const isLoading = isLoadingStrategies || isLoadingIndicators
  const isLoadingUpdate = updateStrategy.isPending || isLoadingStrategies || isRefetching

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
        {strategies.map((strategy) => (<StrategyDetail key={strategy.id} strategy={strategy} onChange={updateStrategy.mutate} />))}
      </Card.Body>
      <Card.Footer className="flex gap-5" alignItems="flex-end">
        {indicators.map((indicator) => (<IndicatorDetail key={indicator.id} indicator={indicator} onChange={updateIndicator.mutate} />))}
      </Card.Footer>
    </Card.Root>
  )
}
