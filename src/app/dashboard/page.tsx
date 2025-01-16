'use client'
import { Box, Grid, HStack, Heading, Tabs, Text } from '@chakra-ui/react'
import { getCurrentWeekFromStartDate } from '@/app/util'
import { DEFAULT_WEEKS } from '@/app/constants'
import { MdCelebration } from 'react-icons/md'
import { ProgressBar, ProgressRoot, ProgressValueText } from '@/components/ui/progress'
import { usePlanContext } from '@/app/providers/usePlanContext'
import dayjs from 'dayjs'
// import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { Week } from '@/app/dashboard/Week/Week'

export default function Dashboard() {
  const { planActions, goalActions } = usePlanContext()
  const { data: currentPlan, isLoading } = planActions.useGet()
  const { data: goals = [] } = goalActions.useGetByPlanId(currentPlan?.id as string)
  // console.log('Current plan from actions', currentPlan)
  // console.log('Current GOAL goalHist from plan from actions', goalHist)
  const today = dayjs().format('DD MMMM YYYY')
  const endOfYPlan = dayjs(currentPlan?.endDate).format('DD MMMM YYYY')
  const currentWeek = getCurrentWeekFromStartDate(currentPlan?.startDate as Date)
  console.log({
    endOfYPlan,
    currentPlan,
    start: currentPlan?.startDate
  })
  // const data = getChartData(planTracker)

  if (isLoading) {
    return (
      <div>
        Loading current plan...
      </div>
    )
  }

  if (!currentPlan) {
    return (
      <div>
        Seems you dont have any plan open, go to create a new one...
      </div>
    )
  }

  return (
    <Grid>
      <Grid gap="1rem" gridTemplateColumns="30% 70%" padding="1rem 0" alignItems="center">
        <Box>
          <Heading size="4xl">Week {currentWeek}</Heading>
          <Box>
            <Grid gridTemplateColumns="80% 20%" gap="1rem" alignItems="center">
              <ProgressRoot striped animated colorPalette="cyan">
                <HStack gap="5">
                  <ProgressBar flex="1" />
                  <ProgressValueText>{currentWeek}/12</ProgressValueText>
                </HStack>
              </ProgressRoot>
              <MdCelebration />
            </Grid>
          </Box>
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

      <Box marginTop="2rem">
        <Tabs.Root lazyMount unmountOnExit defaultValue={`tab-${currentWeek}`} fitted variant="subtle">
          <Tabs.List>
            {DEFAULT_WEEKS.map((week) => (
              <Tabs.Trigger key={`week-${week}`} value={`tab-${week}`}>W-{week}</Tabs.Trigger>
            ))}
            <Tabs.Indicator rounded="l2" />
          </Tabs.List>
          {DEFAULT_WEEKS.map((week) => (
            <Tabs.Content key={week} value={`tab-${week}`}>
              <Week seq={Number(week)} goals={goals} plan={currentPlan} />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Box>
    </Grid>
  )
}
