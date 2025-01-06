'use client'
import { Box, Flex, Grid, Tabs } from '@chakra-ui/react'
import { Week } from './Week/Week'
import { getCurrentWeekFromStartDate } from '@/util'
import { mockedPlan } from './mockedData'
import { createPlanTracker } from '../createPlanTracker'
import { WEEKS } from '../constants'


export default function Dashboard() {
  const planTracker = createPlanTracker(mockedPlan)
  const currentWeek = getCurrentWeekFromStartDate(planTracker.startDate)

  return (
    <Grid>
      <Flex gap=" 1rem">
        <Box>
          <h1>Week {currentWeek} </h1>
          <p>here should be a slider?</p>
        </Box>
        <Box>
          Current chart progress of the plan
        </Box>
      </Flex>

      <Box>
        <Tabs.Root lazyMount unmountOnExit defaultValue="week-1" fitted variant="subtle">
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
