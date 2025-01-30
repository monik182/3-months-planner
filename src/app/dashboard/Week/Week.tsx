import { GoalDetail } from '@/app/dashboard/Week/GoalDetail'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { calculatePlanEndDate, calculateWeekStartDate, formatDate } from '@/app/util'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { Plan } from '@prisma/client'

interface WeekProps {
  seq: number
  plan: Plan
}

export function Week({ seq, plan }: WeekProps) {  
  const { goalHistoryActions } = usePlanContext()
  //TODO: filter by status active
  const { data: goals = [], isLoading } = goalHistoryActions.useGetByPlanId(plan?.id as string, seq.toString())
  const startDate = calculateWeekStartDate(plan.startDate, seq)
  const endDate = calculatePlanEndDate(startDate)

  if (isLoading) {
    return (
      <div>
        Loading goals...
      </div>
    )
  }

  return (
    <Flex gap="2rem" flexDirection="column">
      <Flex gap="2rem" alignItems="center">
        <Box>
          <Heading fontSize="2xl">Week {seq}</Heading>
          <Text fontSize="sm">{formatDate(startDate)} - {formatDate(endDate)}</Text>
        </Box>
        <Text fontSize="lg">future score...</Text>
      </Flex>
      <Grid gap="1.5rem" gridTemplateColumns="1fr 1fr">
        {goals.map(g => (<GoalDetail key={g.id} goal={g} seq={seq} />))}
      </Grid>
    </Flex>
  )
}
