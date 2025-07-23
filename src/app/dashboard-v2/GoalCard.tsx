import { Goal } from '@prisma/client';
import WeekProgressIndicator from './WeekProgressIndicator';
import { Box, Card, Flex, Heading, Badge, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useEffect, useMemo, useState } from 'react';
import { usePlanContext } from '@/app/providers/usePlanContext';
import { setStrategyOrder, getOrderedStrategies } from '@/app/util/order';
import { StrategyHistoryExtended } from '@/app/types/types';

export interface GoalAction {
  id: string
  name: string
  completedDays: Record<string, boolean>
}

interface GoalCardProps {
  goal: Goal
  sequence: number
  totalWeeks?: number
}

export default function GoalCard({ goal, sequence }: GoalCardProps) {
  const { strategyHistoryActions } = usePlanContext()
  const { data: strategies = [], isFetching: isFetchingStrategies } = strategyHistoryActions.useGetByPlanId(goal.planId)
  const updateStrategy = strategyHistoryActions.useUpdate()
  const [loadingToggle, setLoadingToggle] = useState<{actionId: string, index: number} | null>(null)

  const goalStrategies = useMemo(
    () => strategies.filter((s) => s.strategy.goalId === goal.id && s.sequence === sequence),
    [strategies, goal.id]
  )
  const orderedStrategies: StrategyHistoryExtended[] = getOrderedStrategies(goal.planId, goalStrategies)

  const handleToggleStrategy = (id: string, index: number) => {
    const strategy = orderedStrategies.find((s) => s.id === id)
    if (!strategy) return

    let updatedFrequencies = [...strategy.frequencies]

    if (!updatedFrequencies.length) {
      updatedFrequencies = Array(7).fill(false)
    } else if (updatedFrequencies.length < 7) {
      updatedFrequencies = [
        ...updatedFrequencies,
        ...Array(7 - updatedFrequencies.length).fill(false),
      ]
    }

    updatedFrequencies[index] = !updatedFrequencies[index]
    setLoadingToggle({ actionId: id, index })
    updateStrategy.mutate({
      strategyId: id,
      updates: { frequencies: updatedFrequencies },
    })
  }

  const calculateCompletionPercentage = () => {
    const total = orderedStrategies.reduce((acc, strategy) => {
      return acc + strategy.strategy.frequency
    }, 0)

    const completed = orderedStrategies.reduce((acc, strategy) => {
      return acc + strategy.frequencies.filter(Boolean).length
    }, 0)

    if (total === 0) return 0
    return Math.floor((completed / total) * 100)
  }

  useEffect(() => {
    if (!loadingToggle) return
    if (!updateStrategy.isPending && !isFetchingStrategies) {
      setLoadingToggle(null)
    }
  }, [loadingToggle, updateStrategy.isPending, isFetchingStrategies])

  useEffect(() => {
    if (!goal.planId || orderedStrategies.length === goalStrategies.length) return
    setStrategyOrder(goal.planId, goalStrategies.map((s) => s.id))
  }, [goalStrategies, goal.planId, orderedStrategies])

  return (
    <Card.Root>
      <Card.Header pb={2} display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Heading size="md">{goal.content}</Heading>
        </Box>
      </Card.Header>
      <Card.Body pt={4}>
        <Box mb={5}>
          <WeekProgressIndicator
            completionPercentage={calculateCompletionPercentage()}
          />
        </Box>
        <Box display="flex" flexDirection="column" gap={6}>
          {orderedStrategies.length === 0 && (
            <Box textAlign="center">
              <Link href="/plan-v2">
                <Button variant="outline" size="sm">
                  Edit goal to add actions
                </Button>
              </Link>
            </Box>
          )}

          {orderedStrategies.map((action) => {
            const completedCount = action.frequencies.filter(Boolean).length
            const reachedLimit = completedCount >= action.strategy.frequency

            return (
              <Box key={action.id} display="flex" flexDirection="column" gap={2}>
                <Flex justify="space-between" align="center">
                  <Heading as="h4" size="sm">{action.strategy.content}</Heading>
                  <Badge colorPalette="green" borderRadius="md">
                    {reachedLimit ? (
                      'Complete action'
                    )
                      : (
                        <Text as="span" colorPalette="gray.500">
                          {completedCount}/{action.strategy.frequency}
                        </Text>
                      )
                    }
                  </Badge>
                </Flex>
                <Flex flexWrap="wrap" gap={2}>
                  {[...Array(7).keys()].map((_, index) => {
                    const isCompleted = action.frequencies[index]
                    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]

                    return (
                      <Box key={index} display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Text fontSize="xs" color="gray.500">{dayName}</Text>
                        <Button
                          onClick={() => handleToggleStrategy(action.id, index)}
                          size="xs"
                          variant={isCompleted ? 'solid' : 'outline'}
                          colorScheme={isCompleted ? 'green' : 'gray'}
                          borderRadius="full"
                          p={0}
                          minW="24px"
                          h="24px"
                          aria-label={`${isCompleted ? 'Mark as incomplete' : 'Mark as complete'} for ${dayName}`}
                          disabled={reachedLimit && !isCompleted}
                          loading={loadingToggle?.actionId === action.id &&
                            loadingToggle?.index === index &&
                            (updateStrategy.isPending || isFetchingStrategies)}
                        >
                          {isCompleted && '✓'}
                        </Button>
                      </Box>
                    )
                  })}
                </Flex>
              </Box>
            )
          })}
        </Box>
      </Card.Body>
    </Card.Root>
  )
}
