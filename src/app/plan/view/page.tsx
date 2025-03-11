'use client'
import withAuth from '@/app/hoc/withAuth'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { useDebouncedCallback } from 'use-debounce'
import { useState, useEffect } from 'react'
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
  Spinner,
  IconButton,
  Button,
  Editable
} from '@chakra-ui/react'
import { toaster } from '@/components/ui/toaster'
import {
  LuCheck,
  LuEye,
  LuTarget,
  LuCalendarDays,
  LuCalendarCheck,
  LuChevronRight,
  LuPlus,
} from 'react-icons/lu'
import { useRouter } from 'next/navigation'
import { Tooltip } from '@/components/ui/tooltip'
import { AiOutlineBarChart } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import { formatDate } from '@/app/util'

function PlanView() {
  const router = useRouter()
  const { plan, isLoading: loadingPlan, goalActions, strategyActions, indicatorActions, planActions } = usePlanContext()
  const { data: goals = [], isLoading: loadingGoals } = goalActions.useGetByPlanId(plan?.id as string)
  const { data: strategies = [], isLoading: loadingStrategies } = strategyActions.useGetByPlanId(plan?.id as string)
  const { data: indicators = [], isLoading: loadingIndicators } = indicatorActions.useGetByPlanId(plan?.id as string)
  const updatePlan = planActions.useUpdate()
  const [editingVision, setEditingVision] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState(false)
  const [vision, setVision] = useState('')
  const [milestone, setMilestone] = useState('')
  const loading = loadingPlan || loadingGoals || loadingStrategies || loadingIndicators || updatePlan.isPending

  const debouncedUpdateVision = useDebouncedCallback((vision: string) => {
    if (plan) {
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
  }, 1000)

  const debouncedUpdateMilestone = useDebouncedCallback((milestone: string) => {
    if (plan) {
      updatePlan.mutate(
        { planId: plan.id, updates: { milestone } },
        {
          onSuccess: () => {
            toaster.create({
              title: 'Milestone updated',
              type: 'success',
              duration: 2000
            })
            setEditingMilestone(false)
          },
          onError: (error) => {
            toaster.create({
              title: 'Error updating milestone',
              description: error.message,
              type: 'error'
            })
          }
        }
      )
    }
  }, 1000)

  useEffect(() => {
    if (plan) {
      setVision(plan.vision)
      setMilestone(plan.milestone)
    }
  }, [plan])

  if (loading) {
    return (
      <Center height="80vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  if (!plan) return null

  const handleVisionChange = (value: string) => {
    setVision(value)
  }

  const handleMilestoneChange = (value: string) => {
    setMilestone(value)
  }

  const handleVisionSubmit = () => {
    debouncedUpdateVision(vision)
  }

  const handleMilestoneSubmit = () => {
    debouncedUpdateMilestone(milestone)
  }

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
        // className="bg-gradient-to-r from-purple-500 to-indigo-600"
        >
          <VStack align="start" gap={1}>
            <Heading size="xl">Your 12-Week Plan</Heading>
            <Text fontSize="md">Track your progress and achieve your goals</Text>
          </VStack>

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
              // bgGradient="linear(to-r, indigo.400, purple.400)"
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
              bg={plan.started ? "green.400" : "amber.400"}
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
            <Tooltip content={editingVision ? "Save" : "Edit"}>
              <IconButton
                aria-label={editingVision ? "Save vision" : "Edit vision"}
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (editingVision) {
                    handleVisionSubmit()
                  } else {
                    setEditingVision(true)
                  }
                }}
              >
                {editingVision ? <LuCheck /> : <CiEdit />}
              </IconButton>
            </Tooltip>
          </Flex>
          {editingVision ? (
            <Editable.Root
              value={vision}
              onValueChange={e => handleVisionChange(e.value)}
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

        <Card.Root p={6} borderRadius="xl" boxShadow="lg" borderColor="transparent" position="relative">
          <Flex justifyContent="space-between" alignItems="center" mb={3}>
            <Heading size="md" colorPalette="blue.800">
              <HStack>
                <LuTarget />
                <Text>3-Year Milestone</Text>
              </HStack>
            </Heading>
            <Tooltip content={editingMilestone ? "Save" : "Edit"}>
              <IconButton
                aria-label={editingMilestone ? "Save milestone" : "Edit milestone"}
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (editingMilestone) {
                    handleMilestoneSubmit()
                  } else {
                    setEditingMilestone(true)
                  }
                }}
              >
                {editingMilestone ? <LuCheck /> : <CiEdit />}
              </IconButton>
            </Tooltip>
          </Flex>
          {editingMilestone ? (
            <Editable.Root
              value={milestone}
              onValueChange={e => handleMilestoneChange(e.value)}
              fontSize="md"
              colorPalette="gray.700"
              placeholder="Define your 3-year milestone..."
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
              bg={milestone ? "white" : "gray.50"}
              borderRadius="md"
              minHeight="100px"
            >
              {milestone || "No milestone defined yet. Click the edit button to add your 3-year milestone."}
            </Text>
          )}
        </Card.Root>

        <Box>
          <Grid
            templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
            gap={6}
          >
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
                          colorPalette="teal"
                          marginRight={2}
                          borderRadius="md"
                        >
                          Goal {index + 1}
                        </Badge>
                        {goal.content}
                      </Heading>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => router.push('/plan')}
                      >
                        <CiEdit />
                        Edit
                      </Button>
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
                                  <Badge colorPalette="orange" borderRadius="md">
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

            {/* Add Goal Button Card */}
            {/* <GridItem>
              <Card.Root
                borderWidth="1px"
                borderStyle="dashed"
                borderRadius="xl"
                p={5}
                height="100%"
                minHeight="200px"
                bg="gray.50"
                _hover={{ bg: "gray.100", cursor: "pointer" }}
                boxShadow="none"
                onClick={() => router.push('/plan')}
              >
                <Center height="100%">
                  <VStack gap={3}>
                    <Box bg="gray.200" p={3} borderRadius="full">
                      <LuPlus size={24} />
                    </Box>
                    <Text fontWeight="medium">Add New Goal</Text>
                    <Text fontSize="sm" colorPalette="gray.600" textAlign="center">
                      Define additional goals to achieve your vision
                    </Text>
                  </VStack>
                </Center>
              </Card.Root>
            </GridItem> */}
          </Grid>
        </Box>
      </VStack>
    </Box>
  )
}

export default withAuth(PlanView)
