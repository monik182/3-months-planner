import { GoalDetail } from '@/app/dashboard/Week/GoalDetail'
import { useDashboardContext } from '@/app/dashboard/dashboardContext'
import { calculateWeekEndDate, calculateWeekStartDate, formatDate } from '@/app/util'
import { Box, Center, Flex, Grid, Heading, Spinner, Text } from '@chakra-ui/react'
import { Plan } from '@prisma/client'

interface WeekProps {
  seq: number
  plan: Plan
  score: number
}

export function Week({ score, seq, plan }: WeekProps) {  
  const { goalHistoryActions, isRefetching } = useDashboardContext()
  const { data: goals = [], isLoading } = goalHistoryActions.useGetByPlanId(plan?.id as string, seq)
  const startDate = calculateWeekStartDate(plan.startDate, seq)
  const endDate = calculateWeekEndDate(startDate)

  if (isLoading) {
    return (
      <Center height="100%">
        <Spinner />
      </Center>
    )
  }

  return (
    <Flex gap="2rem" flexDirection="column">
      <Flex gap="2rem" alignItems="center">
        <Box>
          <Heading fontSize="2xl">Week {seq}</Heading>
          <Text fontSize="sm">{formatDate(startDate)} - {formatDate(endDate)}</Text>
        </Box>
        <Text fontSize="lg">{isRefetching ? <Spinner size="xs" /> : score}/100%</Text>
      </Flex>
      <Grid gap="1.5rem" gridTemplateColumns={{lg: "1fr 1fr", base: "1fr"}}>
        {goals.map((g) => (<GoalDetail key={g.id} goal={g} seq={seq} />))}
      </Grid>
    </Flex>
  )
}
