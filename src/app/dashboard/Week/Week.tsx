import { Box, Grid, SimpleGrid } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { WeekTracking } from '@/types'
import { Goal } from './Goal'

interface WeekProps {
  week: WeekTracking
}

export function Week({ week }: WeekProps) {
  const formattedStartDate = dayjs(week.startDate).format('DD MMM')
  const formattedEndDate = dayjs(week.endDate).format('DD MMM')

  return (
    <Box>
      <Box>
        <p>Week {week.weekNumber}: {formattedStartDate} - {formattedEndDate}</p>
      </Box>
      <SimpleGrid minChildWidth="sm" gap="40px">
        {week.goals.map((goal) => (<Goal key={goal.id} goal={goal} />))}
      </SimpleGrid>
    </Box>
  )
}
