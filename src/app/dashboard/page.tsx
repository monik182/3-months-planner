'use client'
import { Box, Grid, HStack, Heading, Tabs, Text } from '@chakra-ui/react'
import { Week } from './Week/Week'
import { getChartData, getCurrentWeekFromStartDate } from '@/util'
import { WEEKS } from '../constants'
import { MdCelebration } from 'react-icons/md'
import { ProgressBar, ProgressRoot, ProgressValueText } from '@/components/ui/progress'
import { usePlanTracking } from '../providers/usePlanTracking'
import dayjs from 'dayjs'
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { useProtectedPage } from '../hooks/useProtectedPage'

export default function Dashboard() {
  const { user } = useProtectedPage()
  const today = dayjs().format('DD MMMM YYYY')
  const { plan: planTracker } = usePlanTracking()
  const endOfYPlan = dayjs(planTracker.endDate).format('DD MMMM YYYY')
  const currentWeek = getCurrentWeekFromStartDate(planTracker.startDate)
  const data = getChartData(planTracker)

  if (!user) return null

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
        <LineChart width={1000} height={300} data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" interval={0} />
          <YAxis domain={[0, 100]} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} />
          <Tooltip />
          <Legend formatter={(value) => value.toUpperCase()} />
          <Line type="monotone" dataKey="score" stroke="#8884d8" />
        </LineChart>
      </Grid>

      <Box marginTop="2rem">
        <Tabs.Root lazyMount unmountOnExit defaultValue={`tab-${currentWeek}`} fitted variant="subtle">
          <Tabs.List>
            {WEEKS.map((week) => (
              <Tabs.Trigger key={`week-${week}`} value={`tab-${week}`}>W-{week}</Tabs.Trigger>
            ))}
            <Tabs.Indicator rounded="l2" />
          </Tabs.List>
          {planTracker.weeks.map((week) => (
            <Tabs.Content key={week.id} value={`tab-${week.weekNumber}`}>
              <Week week={week} />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Box>
    </Grid>
  )
}
