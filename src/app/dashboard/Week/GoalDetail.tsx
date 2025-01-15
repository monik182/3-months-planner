import { IndicatorDetail } from '@/app/dashboard/Week/IndicatorDetail'
import { StrategyDetail } from '@/app/dashboard/Week/StrategyDetail'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { Card, Center, Spinner, Text } from '@chakra-ui/react'
import { Goal } from '@prisma/client'

interface GoalProps {
  goal: Goal
  seq: number
}

export function GoalDetail({ goal, seq }: GoalProps) {
  const { strategyHistoryActions, indicatorHistoryActions } = usePlanContext()
  const { data: strategies = [], isLoading: isLoadingStrategies } = strategyHistoryActions.useGetByGoalId(goal.id, seq + '')
  const { data: indicators = [], isLoading: isLoadingIndicators } = indicatorHistoryActions.useGetByGoalId(goal.id, seq + '')

  const updateStrategy = strategyHistoryActions.useUpdate()
  const updateIndicator = indicatorHistoryActions.useUpdate()

  const score = Math.ceil((strategies.filter((s) => s.completed).length / strategies.length) * 100)

  const isLoading = isLoadingStrategies || isLoadingIndicators
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
        <Text fontWeight="bold">{goal.content}</Text>
        <Text fontSize="sm">Score: {isLoadingUpdate ? <Spinner size="xs" /> : score}/100%</Text>
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
