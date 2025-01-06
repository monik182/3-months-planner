'use client'
import { Box, Flex, Grid } from '@chakra-ui/react'
import { Week } from './Week/Week'
import { getCurrentWeekFromStartDate } from '@/util'
import { mockedPlan } from './mockedData'
import { createPlanTracker } from '../createPlanTracker'


export default function Dashboard() {
  const planTracker = createPlanTracker(mockedPlan)
  const currentWeek = getCurrentWeekFromStartDate(planTracker.startDate)

  return (
    <Grid>
      <Flex>
        <Box>
          <h1>Week {currentWeek} </h1>
        </Box>
        <Box>
          Current chart progress of the plan
        </Box>
      </Flex>
      
      <Box>
        <Week startDate={planTracker.startDate} />
      </Box>
    </Grid>
  )
}
