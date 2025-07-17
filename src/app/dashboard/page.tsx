'use client'
import { Box, Button, Flex, Grid, HStack, Heading, Tabs, Text } from '@chakra-ui/react'
import { getCurrentWeekFromStartDate } from '@/app/util'
import { DEFAULT_WEEKS } from '@/app/constants'
import { ProgressBar, ProgressRoot, ProgressValueText } from '@/components/ui/progress'
import { usePlanContext } from '@/app/providers/usePlanContext'
import dayjs from 'dayjs'
import { Week } from '@/app/dashboard/Week/Week'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/ui/empty-state'
import { MdOutlineBeachAccess } from 'react-icons/md'
import { Overview } from '@/app/dashboard/Overview'
import { DashboardProvider, useDashboardContext } from '@/app/dashboard/dashboardContext'

function Dashboard() {
  const router = useRouter()
  const { plan } = usePlanContext()
  const { weeklyScores } = useDashboardContext()
  const today = dayjs().format('DD MMMM YYYY')
  const startOfYPlan = dayjs(plan?.startDate).format('DD MMMM YYYY')
  const endOfYPlan = dayjs(plan?.endDate).format('DD MMMM YYYY')
  const currentWeek = getCurrentWeekFromStartDate(plan?.startDate as Date) || 0
  const hasNotStarted = currentWeek <= 0
  const progressValue = hasNotStarted ? 0 : Math.min((currentWeek / 12) * 100, 100);
  const week = hasNotStarted ? 1 : currentWeek


  return (
    <Grid>
      <Grid gap="1rem" gridTemplateColumns={{ base: "none", lg: "30% 70%" }} padding="1rem 0" alignItems="center" marginTop="1rem">
        <Box>
          <Heading size={{ md: "4xl", base: "xl" }}>Week {week}</Heading>
          {hasNotStarted && <Text fontSize="xs"> (Your plan has not yet started)</Text>}
          <Box>
            <Grid gridTemplateColumns="80% 20%" gap="1rem" alignItems="center">
              <ProgressRoot colorPalette="green" value={progressValue}>
                <HStack gap="5">
                  <ProgressBar flex="1" />
                  <ProgressValueText>{week}/12</ProgressValueText>
                </HStack>
              </ProgressRoot>
            </Grid>
          </Box>
          <Text><b>Start of year:</b> {startOfYPlan}</Text>
          <Text><b>End of year:</b> {endOfYPlan}</Text>
          <Text><b>Today:</b> {today}</Text>
        </Box>
      </Grid>

      {hasNotStarted ?
        <EmptyState
          icon={<MdOutlineBeachAccess />}
          size="lg"
          title={`Your plan starts on ${startOfYPlan}`}
          description="Go ahead and enjoy your time off. Your plan will start soon."
        >
          <Flex gap="1rem" direction="column">
            <Button onClick={() => router.replace('/plan/view')}>View Plan</Button>
          </Flex>
        </EmptyState>
        :
        <Box marginTop="2rem">
          <Tabs.Root lazyMount unmountOnExit defaultValue={`tab-${currentWeek}`} fitted variant="subtle" width="calc(100vw - 6rem)">
            <Tabs.List
              overflowX="auto"
              whiteSpace="nowrap"
              scrollBehavior="smooth"
              gap="1rem"
            >
              <Tabs.Trigger key="overview" value="overview">W-0</Tabs.Trigger>
              {DEFAULT_WEEKS.map((week) => (
                <Tabs.Trigger key={`week-${week}`} value={`tab-${week}`}>W-{week}</Tabs.Trigger>
              ))}
              <Tabs.Indicator rounded="l2" />
            </Tabs.List>
            <Tabs.Content key="overview" value="overview">
              <Overview />
            </Tabs.Content>
            {DEFAULT_WEEKS.map((week, index) => (
              <Tabs.Content key={week} value={`tab-${week}`}>
                <Week seq={Number(week)} plan={plan!} score={weeklyScores[index]} />
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Box>
      }

    </Grid>
  )
}

function DashboardWithContext() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}

export default DashboardWithContext
