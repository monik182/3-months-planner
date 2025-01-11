import { StepLayout } from '../step-layout'
import { Plan, Step } from '@/types'
import dayjs from 'dayjs'
import { DateSelector } from './DateSelector'
import { calculatePlanEndDate } from '@/util'
import { Box, Fieldset, Grid, Input, Stack, VStack, Text, Heading, Flex, Badge } from '@chakra-ui/react'
import { Field } from '../../../components/ui/field'
import { usePlanContext } from '../../providers/usePlanContext'

export function Step4(props: Step<Plan>) {
  const { plan, goals, updatePlan } = usePlanContext()
  const handleDateChange = (startDate: string) => {
    const endDate = calculatePlanEndDate(startDate)
    updatePlan({ startDate, endDate })
  }

  return (
    <StepLayout
      title="Set a Start Date & Reflect"
      description="Choose the start date for your plan, marking the beginning of your journey toward achieving your goals. This is also a chance to review everything you’ve outlined so far—your vision, goals, and strategies—and ensure they align with your priorities and timeline. Take a moment to reflect and adjust if needed before you commit to taking the first step."
    >
      <Grid gap="1rem" templateColumns="1fr 1fr">
        <DateSelector onChange={handleDateChange} date={plan?.startDate} />
        <Fieldset.Root size="lg" disabled>
          <Field label="End Date">
            <Input disabled value={dayjs(plan?.endDate).format('MMMM DD, YYYY')} />
          </Field>
        </Fieldset.Root>
      </Grid>
      <Box maxW="6xl" mx="auto" p={6} overflowY="auto">
        <Box bg="teal.50" p={6} borderRadius="md" mb={6}>
          <Heading size="lg" mb={4}>
            Vision
          </Heading>
          <Text fontSize="md">{plan.vision}</Text>
        </Box>

        <Box bg="blue.50" p={6} borderRadius="md" mb={6}>
          <Heading size="lg" mb={4}>
            Three-Year Milestone
          </Heading>
          <Text fontSize="md">{plan.milestone}</Text>
        </Box>

        <Flex justify="space-between" bg="gray.50" p={4} borderRadius="md" mb={6}>
          <Text>
            <strong>Start Date:</strong> {dayjs(plan.startDate).format('MMMM DD, YYYY')}
          </Text>
          &nbsp;-&nbsp;
          <Text>
            <strong>End Date:</strong> {dayjs(plan.endDate).format('MMMM DD, YYYY')}
          </Text>
        </Flex>

        <Box>
          <Heading size="lg" mb={4}>
            Goals
          </Heading>
          <Stack>
            {goals.map((goal) => (
              <Box
                key={goal.id}
                borderWidth="1px"
                borderRadius="md"
                p={6}
                bg="white"
                boxShadow="sm"
              >
                <Heading size="md" mb={4}>
                  {goal.content}
                </Heading>
              
                {goal.strategies.filter(strategy => !!strategy.content).length && (
                  <Box mb={4}>
                    <Heading size="sm" mb={2}>
                      Strategies
                    </Heading>
                    {goal.strategies.filter(strategy => !!strategy.content).map((strategy) => (
                      <Box key={strategy.id} mb={2}>
                        <Badge colorScheme="teal" mr={2}>
                          Strategy
                        </Badge>
                        {strategy.content}
                        <Text fontSize="sm" color="gray.600">
                          Weeks: {strategy.weeks.join(', ')}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                )}

                {goal.indicators.length && (
                  <Box>
                    <Heading size="sm" mb={2}>
                      Indicators
                    </Heading>
                    {goal.indicators.map((indicator, index) => (
                      <VStack key={index} align="start" mb={2}>
                        <Text>
                          <strong>Value:</strong> {indicator.value}
                        </Text>
                        <Text>
                          <strong>Starting Number:</strong>{' '}
                          {indicator.startingNumber !== null
                            ? indicator.startingNumber
                            : 'N/A'}
                        </Text>
                        <Text>
                          <strong>Goal Number:</strong>{' '}
                          {indicator.goalNumber !== null
                            ? indicator.goalNumber
                            : 'N/A'}
                        </Text>
                        <Text>
                          <strong>Metric:</strong> {indicator.metric}
                        </Text>
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
