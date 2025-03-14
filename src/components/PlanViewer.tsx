'use client'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
  Card,
  Center,
  IconButton,
  Button,
  Editable,
  Spinner
} from '@chakra-ui/react'
import { toaster } from '@/components/ui/toaster'
import {
  LuCheck,
  LuEye,
  LuCalendarDays,
  LuCalendarCheck,
  LuChevronRight,
} from 'react-icons/lu'
import { useRouter } from 'next/navigation'
import { Tooltip } from '@/components/ui/tooltip'
import { AiOutlineBarChart } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import { createGoalHistoryList, createIndicatorHistoryList, createStrategyHistoryList, formatDate } from '@/app/util'
import { DEFAULT_FREQUENCY_LIST } from '@/app/constants'
import { GoalManager } from '@/components/GoalManager/GoalManager'
import { useDebouncedCallback } from 'use-debounce'
import { PiTarget } from 'react-icons/pi'

export default function PlanViewer({ readonly = true }: { readonly?: boolean }) {
  const router = useRouter()
  const { plan, goalActions, strategyActions, indicatorActions, planActions, goalHistoryActions, strategyHistoryActions, indicatorHistoryActions } = usePlanContext()
  const { data: goals = [] } = goalActions.useGetByPlanId(plan?.id as string)
  const { data: strategies = [] } = strategyActions.useGetByPlanId(plan?.id as string)
  const { data: indicators = [] } = indicatorActions.useGetByPlanId(plan?.id as string)
  const createBulkGoal = goalHistoryActions.useCreateBulk()
  const createBulkStrategy = strategyHistoryActions.useCreateBulk()
  const createBulkIndicator = indicatorHistoryActions.useCreateBulk()
  const [initialGoals, setInitialGoals] = useState<string[]>([])
  const [initialStrategies, setInitialStrategies] = useState<string[]>([])
  const [initialIndicators, setInitialIndicators] = useState<string[]>([])
  const updatePlan = planActions.useUpdate()
  const [editingVision, setEditingVision] = useState(false)
  const [editingGoals, setEditingGoals] = useState(false)
  const [vision, setVision] = useState('')
  const loadingGoals = createBulkGoal.isPending || createBulkStrategy.isPending || createBulkIndicator.isPending

  const handleVisionUpdate = (value: string) => {
    setVision(value)
    debouncedVisionUpdate()
  }

  const updateVision = () => {
    if (plan && plan.vision !== vision) {
      updatePlan.mutate(
        { planId: plan.id, updates: { vision } },
        {
          onSuccess: () => {
            toaster.create({
              title: 'Vision updated',
              type: 'success',
              duration: 2000
            })
            setEditingVision(false)
          },
          onError: (error) => {
            toaster.create({
              title: 'Error updating vision',
              description: error.message,
              type: 'error'
            })
          }
        }
      )
    }
  }

  const debouncedVisionUpdate = useDebouncedCallback(() => updateVision(), 5000)

  const handleGoalUpdate = async () => {
    await updateGoals()
    setEditingGoals(false)
  }

  const updateGoals = async () => {
    if (!plan) return
    const newGoals = goals.filter(g => !initialGoals.includes(g.id))
    const goalIds = newGoals.map(g => g.id)
    const newStrategies = strategies.filter(s => !initialStrategies.includes(s.id)).filter(s => goalIds.includes(s.goalId))
    const newIndicators = indicators.filter(i => !initialIndicators.includes(i.id)).filter(i => goalIds.includes(i.goalId))

    console.log('NEW GOALS>>>>>>', newGoals, goals)
    console.log('NEW STRATEGIES>>>>>>', newStrategies, strategies)
    console.log('NEW INDICATORS>>>>>>', newIndicators, indicators)
    if (newGoals.length) {
      await createBulkGoal.mutateAsync(createGoalHistoryList(plan.id, newGoals), {
        onSuccess: () => {
          setInitialGoals([])
          toaster.create({
            title: 'Goals updated',
            type: 'success',
            duration: 2000
          })
        },
        onError: (error) => {
          toaster.create({
            title: 'Error updating goals',
            description: error.message,
            type: 'error'
          })
        }
      })
    }

    if (newStrategies.length) {
      await createBulkStrategy.mutateAsync(createStrategyHistoryList(plan.id, newStrategies), {
        onSuccess: () => {
          setInitialStrategies([])
          toaster.create({
            title: 'Strategies updated',
            type: 'success',
            duration: 2000
          })
        },
        onError: (error) => {
          toaster.create({
            title: 'Error updating strategies',
            description: error.message,
            type: 'error'
          })
        }
      })
    }

    if (newIndicators.length) {
      await createBulkIndicator.mutateAsync(createIndicatorHistoryList(plan.id, newIndicators), {
        onSuccess: () => {
          setInitialIndicators([])
          toaster.create({
            title: 'Indicators updated',
            type: 'success',
            duration: 2000
          })
        },
        onError: (error) => {
          toaster.create({
            title: 'Error updating indicators',
            description: error.message,
            type: 'error'
          })
        }
      })
    }

  }

  useEffect(() => {
    if (plan) {
      setVision(plan.vision)
    }
  }, [plan])

  useEffect(() => {
    if (goals.length && !initialGoals.length) {
      setInitialGoals(goals.map(g => g.id))
    }
    if (strategies.length && !initialStrategies.length) {
      setInitialStrategies(strategies.map(s => s.id))
    }
    if (indicators.length && !initialIndicators.length) {
      setInitialIndicators(indicators.map(i => i.id))
    }
  }, [goals.length, strategies.length, indicators.length])

  if (!plan) return null

  return (
    <Box maxW="8xl" mx="auto" p={{ base: 4, md: 8 }} overflowY="auto">
      <VStack gap={8} align="stretch">
        <Flex
          direction={{ base: "column", lg: "row" }}
          justify="space-between"
          align={{ base: "start", lg: "center" }}
          p={6}
          borderRadius="xl"
          boxShadow="lg"
        >
          <VStack align="start" gap={1}>
            <Heading size="xl">Your 12-Week Plan</Heading>
            <Text fontSize="md">Track your progress and achieve your goals</Text>
          </VStack>

          {plan.started && (
            <HStack gap={4} mt={{ base: 4, lg: 0 }}>
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                size="md"
              >
                <AiOutlineBarChart />
                Dashboard
              </Button>
            </HStack>
          )}
        </Flex>

        <Card.Root
          p={6}
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
          borderColor="transparent"
        >
          <Flex justifyContent="space-between" alignItems="center" wrap="wrap" gap={6}>
            <VStack align="start" gap={1}>
              <Text fontSize="sm" colorPalette="gray.500" fontWeight="medium">START DATE</Text>
              <HStack gap={2}>
                <Box
                  bg="indigo.50"
                  p={2}
                  borderRadius="md"
                  colorPalette="indigo.500"
                >
                  <LuCalendarDays size={18} />
                </Box>
                <Text fontWeight="bold" fontSize="lg" colorPalette="gray.800">{formatDate(plan.startDate)}</Text>
              </HStack>
            </VStack>

            <Center height="40px">
              <Box height="2px" width="60px" bgGradient="linear(to-r, indigo.300, purple.300)" display={{ base: "none", md: "block" }} />
              <Box
                p={1.5}
                borderRadius="full"
              >
                <LuChevronRight size={16} />
              </Box>
              <Box height="2px" width="60px" bgGradient="linear(to-r, purple.300, pink.300)" display={{ base: "none", md: "block" }} />
            </Center>

            <VStack align="start" gap={1}>
              <Text fontSize="sm" colorPalette="gray.500" fontWeight="medium">END DATE</Text>
              <HStack gap={2}>
                <Box
                  bg="pink.50"
                  p={2}
                  borderRadius="md"
                  colorPalette="pink.500"
                >
                  <LuCalendarCheck size={18} />
                </Box>
                <Text fontWeight="bold" fontSize="lg" colorPalette="gray.800">{formatDate(plan.endDate)}</Text>
              </HStack>
            </VStack>

            <Badge
              bg={plan.started ? "green.400" : "orange.400"}
              color="white"
              size="lg"
              borderRadius="full"
              py={1.5}
              px={4}
              boxShadow="sm"
              fontWeight="medium"
            >
              {plan.started ? "In Progress" : "Not Started"}
            </Badge>
          </Flex>
        </Card.Root>

        <Card.Root p={6} position="relative" borderRadius="xl" boxShadow="lg" borderColor="transparent">
          <Flex justifyContent="space-between" alignItems="center" mb={3}>
            <Heading size="md" colorPalette="purple.800">
              <HStack>
                <LuEye />
                <Text>Long-term Vision</Text>
              </HStack>
            </Heading>
            {!readonly && (
              <Tooltip content={editingVision ? "Save" : "Edit"}>
                <IconButton
                  aria-label={editingVision ? "Save vision" : "Edit vision"}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (editingVision) {
                      updateVision()
                    } else {
                      setEditingVision(true)
                    }
                  }}
                >
                  {editingVision ? <LuCheck /> : <CiEdit />}
                </IconButton>
              </Tooltip>
            )}
          </Flex>
          {editingVision ? (
            <Editable.Root
              value={vision}
              onValueChange={e => handleVisionUpdate(e.value)}
              fontSize="md"
              colorPalette="gray.700"
              placeholder="Define your long-term vision..."
              p={2}
              minHeight="120px"
              autoFocus
            >
              <Editable.Preview minH="48px" alignItems="flex-start" width="full" />
              <Editable.Textarea />
            </Editable.Root>
          ) : (
            <Text
              fontSize="md"
              colorPalette="gray.700"
              p={2}
              bg={vision ? "white" : "gray.50"}
              borderRadius="md"
              minHeight="100px"
            >
              {vision || "No vision defined yet. Click the edit button to add your long-term vision."}
            </Text>
          )}
        </Card.Root>

        <Box>
          <Grid
            templateColumns={{ base: "1fr" }}
            gap={6}
          >
            <Heading size="md" colorPalette="purple.800">
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <HStack>
                  <PiTarget />
                  <Text>Goals & Strategies</Text>
                </HStack>
                {!readonly && (
                  <Tooltip content={editingGoals ? "Save" : "Edit"}>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        if (editingGoals) {
                          handleGoalUpdate()
                        } else {
                          setEditingGoals(true)
                        }
                      }}
                    >
                      {editingGoals ? (loadingGoals ? <Spinner size="xs" /> : <LuCheck />) : <CiEdit />}
                    </Button>
                  </Tooltip>
                )}
              </Flex>
            </Heading>
            {editingGoals
              ? (
                <GoalManager onChange={updateGoals} />
              )
              : (
                <>
                  {goals.filter((goal) => !!goal.content).map((goal, index) => (
                    <GridItem key={goal.id}>
                      <Card.Root
                        borderWidth="1px"
                        p={0}
                        bg="white"
                        borderRadius="xl"
                        boxShadow="lg"
                        borderColor="transparent"
                        overflow="hidden"
                      >
                        <Card.Header bg="gray.50" p={4}>
                          <Flex justify="space-between" align="center">
                            <Heading size="md">
                              <Badge
                                colorPalette="cyan"
                                marginRight={2}
                                borderRadius="md"
                              >
                                Goal {index + 1}
                              </Badge>
                              {goal.content}
                            </Heading>
                          </Flex>
                        </Card.Header>

                        <Card.Body p={4}>
                          {!!strategies.filter(strategy => strategy.goalId === goal.id).length && (
                            <Box mb={4}>
                              <Heading size="sm" mb={3} display="flex" alignItems="center">
                                <Box as="span" mr={2} colorPalette="gray.500">Strategies</Box>
                                <Box flex="1" height="1px" bg="gray.200" />
                              </Heading>

                              <VStack align="stretch" gap={3}>
                                {strategies
                                  .filter(strategy => strategy.goalId === goal.id && !!strategy.content)
                                  .map((strategy, idx) => (
                                    <Flex
                                      key={strategy.id}
                                      p={3}
                                      borderRadius="md"
                                      bg="gray.50"
                                      justify="space-between"
                                      align="center"
                                    >
                                      <VStack align="start" gap={1}>
                                        <Text fontWeight="medium">
                                          <Text as="span" colorPalette="gray.500" fontSize="sm" mr={1}>
                                            {idx + 1}.
                                          </Text>
                                          {strategy.content}
                                        </Text>
                                        <Text fontSize="xs" colorPalette="gray.600">
                                          Weeks: {strategy.weeks.length === 12 ? 'Every week' : strategy.weeks.join(', ')}
                                        </Text>
                                        <Text fontSize="xs" colorPalette="gray.600">
                                          <span>{DEFAULT_FREQUENCY_LIST[strategy.frequency - 1].label}</span>
                                        </Text>
                                      </VStack>
                                    </Flex>
                                  ))}
                              </VStack>
                            </Box>
                          )}

                          {!!indicators.filter(indicator => indicator.goalId === goal.id).length && (
                            <Box>
                              <Heading size="sm" mb={3} display="flex" alignItems="center">
                                <Box as="span" mr={2} colorPalette="gray.500">Indicators</Box>
                                <Box flex="1" height="1px" bg="gray.200" />
                              </Heading>

                              <VStack align="stretch" gap={3}>
                                {indicators
                                  .filter(indicator => indicator.goalId === goal.id && !!indicator.content)
                                  .map((indicator) => (
                                    <Box
                                      key={indicator.id}
                                      p={3}
                                      borderRadius="md"
                                      bg="gray.50"
                                    >
                                      <HStack mb={1}>
                                        <Badge colorPalette="yellow" borderRadius="md">
                                          Indicator
                                        </Badge>
                                        <Text fontWeight="medium">{indicator.content}</Text>
                                      </HStack>

                                      <Flex justify="space-between" fontSize="sm" colorPalette="gray.600">
                                        <Text>Start: {indicator.initialValue} {indicator.metric}</Text>
                                        <Text>Target: {indicator.goalValue} {indicator.metric}</Text>
                                      </Flex>
                                    </Box>
                                  ))}
                              </VStack>
                            </Box>
                          )}
                        </Card.Body>
                      </Card.Root>
                    </GridItem>
                  ))}
                </>
              )}
          </Grid>
        </Box>
      </VStack>
    </Box>
  )
}
