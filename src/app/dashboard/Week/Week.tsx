import { GoalDetail } from '@/app/dashboard/Week/GoalDetail'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { calculateWeekEndDate, calculateWeekStartDate, formatDate } from '@/app/util'
import { Box, Center, Flex, Grid, Heading, Spinner, Text } from '@chakra-ui/react'
import { Plan } from '@prisma/client'
import { useState } from 'react'

interface WeekProps {
  seq: number
  plan: Plan
}

export function Week({ seq, plan }: WeekProps) {  
  const { goalHistoryActions } = usePlanContext()
  const { data: goals = [], isLoading } = goalHistoryActions.useGetByPlanId(plan?.id as string, seq)
  const startDate = calculateWeekStartDate(plan.startDate, seq)
  const endDate = calculateWeekEndDate(startDate)
  const [score, setScore] = useState<number[]>(Array(goals.length).fill(0))

  const handleGoalScoreUpdate = (index: number, score: number) => {
    setScore(prev => {
      const newScore = [...prev]
      newScore[index] = score
      return newScore
    })
  }

  const weekScore = Math.floor(score.reduce((acc, score) => acc + score, 0) / (goals.length || 1))

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
        <Text fontSize="lg">{weekScore}/100%</Text>
      </Flex>
      <Grid gap="1.5rem" gridTemplateColumns={{lg: "1fr 1fr", base: "1fr"}}>
        {goals.map((g, index) => (<GoalDetail key={g.id} goal={g} seq={seq} onScoreCalculated={(score) => handleGoalScoreUpdate(index, score)} />))}
      </Grid>
    </Flex>
  )
}
