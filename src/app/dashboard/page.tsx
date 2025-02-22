'use client'
import { Box, Button, Center, Flex, Grid, HStack, Heading, Spinner, Tabs, Text } from '@chakra-ui/react'
import { getCurrentWeekFromStartDate } from '@/app/util'
import { DEFAULT_WEEKS } from '@/app/constants'
import { ProgressBar, ProgressRoot, ProgressValueText } from '@/components/ui/progress'
import { usePlanContext } from '@/app/providers/usePlanContext'
import dayjs from 'dayjs'
import { Week } from '@/app/dashboard/Week/Week'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/ui/empty-state'
import { MdOutlineBeachAccess } from 'react-icons/md'
import { useAccountContext } from '@/app/providers/useAccountContext'
import withAuth from '@/app/hoc/withAuth'

function Dashboard() {
  const router = useRouter()
  const { user } = useAccountContext()
  const { planActions } = usePlanContext()
  const { data: plan, isLoading } = planActions.useGet(user?.id as string)
  const today = dayjs().format('DD MMMM YYYY')
  const startOfYPlan = dayjs(plan?.startDate).format('DD MMMM YYYY')
  const endOfYPlan = dayjs(plan?.endDate).format('DD MMMM YYYY')
  const currentWeek = getCurrentWeekFromStartDate(plan?.startDate as Date) || 0
  const hasNotStarted = currentWeek <= 0
  const progressValue = hasNotStarted ? 0 : currentWeek / 12 * 100
  const week = hasNotStarted ? 1 : currentWeek

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  if (!plan) return null

  return (
    <Grid>
      <Grid gap="1rem" gridTemplateColumns={{ base: "none", lg: "30% 70%" }} padding="1rem 0" alignItems="center" marginTop="1rem">
        <Box>
          <Heading size="4xl">Week {week}</Heading>
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
        {/* <LineChart width={1000} height={300} data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" interval={0} />
          <YAxis domain={[0, 100]} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} />
          <Tooltip />
          <Legend formatter={(value) => value.toUpperCase()} />
          <Line type="monotone" dataKey="score" stroke="#8884d8" />
        </LineChart> */}
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
          <Tabs.Root lazyMount unmountOnExit defaultValue={`tab-${currentWeek}`} fitted variant="subtle"  width="calc(100vw - 6rem)">
            <Tabs.List
              overflowX="auto"
              whiteSpace="nowrap"
              scrollBehavior="smooth"
              gap="1rem"
            >
              {DEFAULT_WEEKS.map((week) => (
                <Tabs.Trigger key={`week-${week}`} value={`tab-${week}`}>W-{week}</Tabs.Trigger>
              ))}
              <Tabs.Indicator rounded="l2" />
            </Tabs.List>
            {DEFAULT_WEEKS.map((week) => (
              <Tabs.Content key={week} value={`tab-${week}`}>
                <Week seq={Number(week)} plan={plan!} />
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </Box>
      }

    </Grid>
  )
}

export default withAuth(Dashboard)
