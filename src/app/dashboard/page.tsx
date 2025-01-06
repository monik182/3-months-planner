'use client'
import { Box, Flex, Grid } from '@chakra-ui/react';
import { Week } from './Week/Week';
import { getCurrentWeekFromStartDate } from '../util';

export default function Dashboard() {
  const startDate = '2024-11-04'
  const currentWeek = getCurrentWeekFromStartDate(startDate)

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
        <Week startDate={startDate} />
      </Box>
    </Grid>
  )
}
