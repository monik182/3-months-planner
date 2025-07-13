'use client'
import { DashboardProvider, useDashboardContext } from '@/app/dashboard/dashboardContext'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { getCurrentWeekFromStartDate, handleKeyDown } from '@/app/util'
import { SavingSpinner } from '@/components/SavingSpinner'
import { Button } from '@/components/ui/button'
import { ProgressBar, ProgressRoot, ProgressValueText } from '@/components/ui/progress'
import { Box, Card, Collapsible, Container, Flex, HStack, Heading, Spacer, Stat, Text, Textarea, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'
import { LuCalendarDays } from 'react-icons/lu'

function PlanV2Page() {
  const { plan, planActions } = usePlanContext()
  const { planScore } = useDashboardContext()
  const startOfYPlan = dayjs(plan?.startDate).format('MMMM, DD YYYY')
  const endOfYPlan = dayjs(plan?.endDate).format('MMMM, DD YYYY')
  const currentWeek = getCurrentWeekFromStartDate(plan?.startDate as Date) || 0
  const hasNotStarted = currentWeek <= 0
  const progressValue = hasNotStarted ? 0 : currentWeek / 12 * 100
  const week = hasNotStarted ? 1 : currentWeek
  const [editing, setEditing] = useState(false)
  const [vision, setVision] = useState(plan?.vision || '')
  const update = planActions.useUpdate()
  const [detailsOpen, setDetailsOpen] = useState(false)

  const toggleDetails = () => {
    setDetailsOpen(!detailsOpen)
  }

  const handleSave = () => {
    setEditing(false)
    update.mutate({ planId: plan!.id, updates: { vision } })
  }

  const handleCancel = () => {
    setEditing(false)
    setVision(plan!.vision)
  }

  return (
    <Container padding="10px">
      <Flex gap="20px" direction="column">
        <Box shadow="lg" padding="20px" borderRadius="sm" border="none" className="flex gap-5 flex-col">
          <Flex justifyContent={{  base: 'flex-start', md: 'space-between' }} flexDirection={{ base: 'column', md: 'row' }}>
            <VStack gap="2" align="start" mb="4">
              <Heading size="2xl">My Plan</Heading>
              <HStack gap="2">
                <LuCalendarDays />
                <Text fontWeight="light" fontSize="sm" color="gray.500">{startOfYPlan} to {endOfYPlan}</Text>
              </HStack>
            </VStack>
            <Flex gap="4" >
              <Stat.Root maxW="300px" borderWidth="1px" p="4" rounded="md" alignItems="center" justifyContent="center">
                <HStack justify="space-between">
                  <Stat.Label>Current Week</Stat.Label>
                </HStack>
                <Stat.ValueText>{currentWeek}/12</Stat.ValueText>
              </Stat.Root>
              <Stat.Root maxW="300px" borderWidth="1px" p="4" rounded="md" alignItems="center" justifyContent="center">
                <HStack justify="space-between">
                  <Stat.Label>Progress</Stat.Label>
                </HStack>
                <Stat.ValueText>{planScore}%</Stat.ValueText>
              </Stat.Root>
            </Flex>
          </Flex>
          <ProgressRoot colorPalette="yellow" value={progressValue}>
            <HStack gap="5">
              <ProgressBar flex="1" />
              <ProgressValueText>{week}/12</ProgressValueText>
            </HStack>
          </ProgressRoot>
          <Card.Root>
            <Card.Body gap="2">
              {/* TODO: change to this year's vision? */}
              <Card.Title mt="2">Define your long term vision</Card.Title>
              <Card.Description>
                Dare to dream without limits. Picture a future where you've achieved everything you’ve ever desired. Be bold and dream unapologetically—this is your life, your vision, your legacy. What passions have you followed fearlessly? What does fulfillment look like in your career, relationships, and personal growth? Envision a life where every choice you make aligns with your deepest values and aspirations. Let your imagination run free, embrace your wildest ambitions, and create a vision that excites and motivates you every day. Dream as if failure isn’t an option, and let your boldness pave the way.
              </Card.Description>
              <Spacer />
              {editing || update.isPending ? (
                <Textarea
                  autoresize
                  size="xl"
                  variant="subtle"
                  value={vision}
                  readOnly={update.isPending}
                  onChange={(e) => setVision(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleSave)}
                  placeholder="Think big. What are the dreams you’ve always wanted to pursue? How would your life look if you reached your full potential? Be bold and dream unapologetically."
                />
              ) : (
                <Text fontSize="sm">{plan.vision}</Text>
              )}

              <SavingSpinner loading={update.isPending} />
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
              {editing || update.isPending ? (
                <>
                  <Button variant="outline" onClick={handleCancel} disabled={update.isPending}>Cancel</Button>
                  <Button onClick={handleSave} disabled={update.isPending}>Save</Button>
                </>
              ) : (
                <Button variant="ghost" onClick={() => setEditing(true)}>Edit</Button>
              )}
            </Card.Footer>
          </Card.Root>
          <Card.Root>
            <Card.Body gap="2">
              <Card.Title mt="2">Goals</Card.Title>
              <Card.Description>
                <GoalDescription open={detailsOpen} onToggle={toggleDetails} />
              </Card.Description>
              {/* TODO: Goals section */}
              <section>

              </section>
            </Card.Body>
            {/* <Card.Footer justifyContent="flex-end">
              {editing || update.isPending ? (
                <>
                  <Button variant="outline" onClick={handleCancel} disabled={update.isPending}>Cancel</Button>
                  <Button onClick={handleSave} disabled={update.isPending}>Save</Button>
                </>
              ) : (
                <Button variant="ghost" onClick={() => setEditing(true)}>Edit</Button>
              )}
            </Card.Footer> */}
          </Card.Root>
        </Box>
        <Box shadow="lg" padding="20px" borderRadius="sm" border="none">Tracking here</Box>
      </Flex>
    </Container>
  )
}

function PlanV2WithContext() {
  return (
    <DashboardProvider>
      <PlanV2Page />
    </DashboardProvider>
  )
}

export default PlanV2WithContext

function GoalDescription({ open, onToggle }: { open: boolean, onToggle: () => void }) {
  return (
    <div className="text-gray-700">
      <Text textStyle="sm">Goals are the building blocks of your vision. They start with a clear action verb and are written as complete sentences.</Text>

      <Collapsible.Root open={open}>
        <Collapsible.Trigger
          onClick={onToggle}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mt-2 mb-1"
        >
          {open ? 'Show less' : 'Show more'}
          {open ? <HiChevronUp size={16} className="ml-1" /> : <HiChevronDown size={16} className="ml-1" />}
        </Collapsible.Trigger>

        <Collapsible.Content className="text-sm space-y-2">
          <Text textStyle="sm">To create effective goals, follow these criteria:</Text>

          <ul className="list-disc pl-5 space-y-1">
            <li><Text textStyle="sm"><strong>Specific and Measurable:</strong> Clearly define what you want to achieve and how progress will be measured.</Text></li>
            <li><Text textStyle="sm"><strong>Positive Framing:</strong> Write goals as affirmations of what you will accomplish.</Text></li>
            <li><Text textStyle="sm"><strong>Realistic Ambition:</strong> Set goals that are challenging yet attainable.</Text></li>
            <li><Text textStyle="sm"><strong>Time-Bound:</strong> Tie each goal to a specific due date.</Text></li>
          </ul>

          <Text textStyle="sm" className="italic">Focus on no more than three goals at a time for maximum effectiveness.</Text>

          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-2">
            <Text textStyle="sm" className="font-medium">Example:</Text>
            <Text textStyle="sm">Instead of "Stop procrastinating," write "Complete my weekly project tasks by Friday."</Text>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}
