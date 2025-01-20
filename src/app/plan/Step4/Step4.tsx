import { StepLayout } from '../stepLayout'
import { Step } from '@/app/types/types'
import dayjs from 'dayjs'
import { Box, Stack, VStack, Text, Heading, Flex, Badge, Separator, HStack, Spinner } from '@chakra-ui/react'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { Plan } from '@prisma/client'

export function Step4({ }: Step<Plan>) {
  const { plan, isLoading: loadingPlan, goalActions, strategyActions, indicatorActions } = usePlanContext()
  const { data: goals = [], isLoading: loadingGoals } = goalActions.useGetByPlanId(plan!.id)
  const { data: strategies = [], isLoading: loadingStrategies } = strategyActions.useGetByPlanId(plan!.id)
  const { data: indicators = [], isLoading: loadingIndicators } = indicatorActions.useGetByPlanId(plan!.id)

  const loading = loadingPlan || loadingGoals || loadingStrategies || loadingIndicators

  if (loading) {
    return (
      <Spinner />
    )
  }

  return (
    <StepLayout
      title="Reflect"
      description="This is a chance to review everything you’ve outlined so far—your vision, goals, and strategies—and ensure they align with your priorities and timeline. Take a moment to reflect and adjust if needed before you commit to taking the first step."
    >
      <Box maxW="6xl" mx="auto" p={6} overflowY="auto">
        <Box bg="teal.50" p={6} borderRadius="md" mb={6}>
          <Heading size="lg" mb={4}>
            Vision
          </Heading>
          <Text fontSize="md">{plan!.vision}</Text>
        </Box>

        <Box bg="blue.50" p={6} borderRadius="md" mb={6}>
          <Heading size="lg" mb={4}>
            Three-Year Milestone
          </Heading>
          <Text fontSize="md">{plan!.milestone}</Text>
        </Box>

        <Flex justify="space-between" bg="gray.50" p={4} borderRadius="md" mb={6}>
          <Text>
            <strong>Start Date:</strong> {dayjs(plan!.startDate).format('MMMM DD, YYYY')}
          </Text>
          &nbsp;-&nbsp;
          <Text>
            <strong>End Date:</strong> {dayjs(plan!.endDate).format('MMMM DD, YYYY')}
          </Text>
        </Flex>

        <Box>
          <Heading size="lg" mb={4}>
            Goals
          </Heading>
          <Stack>
            {goals.filter((goal) => !!goal.content).map((goal, index) => (
              <Box
                key={goal.id}
                borderWidth="1px"
                borderRadius="md"
                p={6}
                bg="white"
                boxShadow="sm"
              >
                <Heading size="md" mb={4}>
                  Goal # {index + 1} {goal.content}
                </Heading>
              
                {!!strategies.filter(strategy => strategy.goalId === goal.id).length && (
                  <Box mb={4}>
                    <Heading size="sm" mb={2}>
                      Strategies
                    </Heading>
                    {strategies.filter(strategy => strategy.goalId === goal.id && !!strategy.content).map((strategy, index) => (
                      <Box key={strategy.id} mb={2}>
                        <Badge colorPalette="teal" mr={2}>
                          Strategy {index + 1}
                        </Badge>
                        {strategy.content}
                        <Text fontSize="sm" color="gray.600">
                          <strong>Weeks:</strong> {strategy.weeks.length === 12 ? 'Every week' : strategy.weeks.join(', ')}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                )}

                {!!indicators.filter(indicator => indicator.goalId === goal.id).length && (
                  <Box>
                    <Heading size="sm" mb={2}>
                      Indicators
                    </Heading>
                    {indicators.filter(indicator => indicator.goalId === goal.id && !!indicator.content).map((indicator, index) => (
                      <VStack key={index} align="start" mb={2}>
                        <HStack>
                          <Badge colorPalette="orange" mr={2}>
                            Indicator
                          </Badge>
                          {indicator.content}
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          <strong>Initial Value:</strong>{' '}
                          {indicator.initialValue !== null
                            ? indicator.initialValue
                            : 'N/A'}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          <strong>Goal Value:</strong>{' '}
                          {indicator.goalValue !== null
                            ? indicator.goalValue
                            : 'N/A'}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          <strong>Metric:</strong> {indicator.metric}
                        </Text>
                        <Separator />
                      </VStack>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </StepLayout>
  )
}
