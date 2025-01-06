'use client'
import { Box, Grid, HStack, Heading, Tabs } from '@chakra-ui/react'
import { Week } from './Week/Week'
import { getCurrentWeekFromStartDate } from '@/util'
import { mockedPlan } from './mockedData'
import { createPlanTracker } from '../createPlanTracker'
import { WEEKS } from '../constants'
import { MdCelebration } from 'react-icons/md'
import { ProgressBar, ProgressRoot, ProgressValueText } from '@/components/ui/progress'


export default function Dashboard() {
  const planTracker = createPlanTracker(mockedPlan)
  const currentWeek = getCurrentWeekFromStartDate(planTracker.startDate)

  return (
    <Grid>
      <Grid gap="1rem" gridTemplateColumns="30% 70%" padding="1rem 0">
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
        </Box>
        <Box>
          Current chart progress of the plan - with week scores
        </Box>
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
