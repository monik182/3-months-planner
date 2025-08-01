'use client'
import { Container, Heading, Grid, Stack, Box, Center, Link } from '@chakra-ui/react'
import { StrategySummaryCard } from '@/components/tracker/StrategySummaryCard'
import { WeeklyBarChart } from '@/components/tracker/WeeklyBarChart'
import { HabitLineChart } from '@/components/tracker/HabitLineChart'
import { DoneHeatmap } from '@/components/tracker/DoneHeatmap'
import { GoalSummaryCard } from '@/components/tracker/GoalSummaryCard'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { StrategyHistoryExtended } from '@/app/types/types'
import { useTrackerMetrics } from '@/app/hooks/useTrackerMetrics'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import NextLink from 'next/link'
import { SlNotebook } from 'react-icons/sl'
import { LuTarget } from 'react-icons/lu'

// Helper: compute done flags per strategy
function computeDoneFlags(strategies: StrategyHistoryExtended[]): Record<string, number[]> {
  const result: Record<string, number[]> = {}
  // data.goals.forEach((g) => {
  //   g.strategies.forEach((s) => {
  //     result[s.id] = Array(12).fill(0)
  //   })
  // })
  // data.history.forEach((h) => {
  //   if (h.sequence >= 1 && h.sequence <= 12) {
  //     if (!result[h.strategyId]) {
  //       result[h.strategyId] = Array(12).fill(0)
  //     }
  //     result[h.strategyId][h.sequence - 1] = h.completed ? 1 : 0
  //   }
  // })
  // strategies.forEach((s) => {
  //   result[s.id] = Array(12).fill(0)
  //   s.frequencies.forEach((f, idx) => {
  //     if (f) {
  //       result[s.id][idx] = 1
  //     }
  //   })
  // })

  strategies.forEach((s) => {
    if (!result[s.strategyId]) {
      result[s.strategyId] = Array(12).fill(0)
    }
    result[s.strategyId][s.sequence - 1] = s.strategy.frequency === s.frequencies.filter(v => !!v).length ? 1 : 0;
  })
  console.log('result', result)
  return result
}

// Helper: compute metrics per strategy
function computeStrategyMetrics(done: Record<string, number[]>) {
  const metrics: Record<string, { complianceRate: number; currentStreak: number; longestStreak: number }> = {}
  Object.entries(done).forEach(([id, arr]) => {
    const total = arr.reduce((a, b) => a + b, 0)
    const complianceRate = (total / arr.length) * 100
    let currentStreak = 0
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i]) currentStreak++
      else break
    }
    let longestStreak = 0
    let streak = 0
    arr.forEach((v) => {
      if (v) {
        streak++
        if (streak > longestStreak) longestStreak = streak
      } else {
        streak = 0
      }
    })
    metrics[id] = { complianceRate, currentStreak, longestStreak }
  })
  return metrics
}

// Helper: compute week metrics
function computeWeekMetrics(done: Record<string, number[]>) {
  const numStrategies = Object.keys(done).length
  const weeklyWinCount = Array(12).fill(0)
  Object.values(done).forEach((arr) => {
    arr.forEach((v, idx) => {
      weeklyWinCount[idx] += v
    })
  })
  const habitPercent = weeklyWinCount.map((c) => (numStrategies ? (c / numStrategies) * 100 : 0))
  return { weeklyWinCount, habitPercent }
}

export default function TrackerPage() {
  const {
    plan,
    goalActions,
    strategyHistoryActions,
    strategies,
    hasStartedPlan,
  } = usePlanContext();

  const { data: goals = [] } = goalActions.useGetByPlanId(plan?.id as string);
  const { data: metrics } = useTrackerMetrics(plan?.id as string);
  
  const { data: historyStrategies = [] } =
    strategyHistoryActions.useGetByPlanId(plan?.id as string);

  if (!goals.length && !strategies.length) {
    return (
      <Center h="full">
        <EmptyState
          icon={<LuTarget />}
          size="lg"
          title="No Goals or Actions"
          description="Add goals and actions in your plan to see your progress."
        >
          <Button colorPalette="cyan">
            <Link asChild color="white" variant="plain" textDecoration="none">
              <NextLink href="/plan">Go To Plan</NextLink>
            </Link>
          </Button>
        </EmptyState>
      </Center>
    )
  }

  if (!hasStartedPlan) {
    return (
      <Center h="full">
        <EmptyState
          icon={<SlNotebook />}
          size="lg"
          title="Plan Not Started"
          description="Start your plan or update it in the plan page."
        >
          <Button colorPalette="cyan">
            <Link asChild color="white" variant="plain" textDecoration="none">
              <NextLink href="/plan">Go To Plan</NextLink>
            </Link>
          </Button>
        </EmptyState>
      </Center>
    )
  }

  const uniqueStrategies = historyStrategies.filter((s, idx, arr) => {
    return arr.findIndex((t) => t.strategyId === s.strategyId) === idx
  })

  const done = computeDoneFlags(historyStrategies)
  const strategyMetrics = computeStrategyMetrics(done)
  const weekMetrics = computeWeekMetrics(done)

  return (
    <Container maxW="6xl" py={8} borderRadius="md">
      <Heading mb={4} size="2xl">My Progress</Heading>
      <Box bg="white" p={4} borderRadius="md" boxShadow="sm" mb={4}>
        <Heading size="md" mb={2}>
          Plan Completion %
        </Heading>
        <HabitLineChart data={weekMetrics.habitPercent} />
      </Box>
      <Stack gap={8} mt={8}>
        <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
          <Heading size="md" mb={2}>
            Weekly Wins
          </Heading>
          <WeeklyBarChart data={weekMetrics.weeklyWinCount} />
        </Box>
        <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
          <Heading size="md" mb={2}>
            Actions Completion %
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(auto-fill, minmax(500px,1fr))' }} gap={4}>
            {uniqueStrategies.map((s) => (
              <StrategySummaryCard
                key={s.strategyId}
                strategy={s}
                metrics={strategyMetrics[s.strategyId]}
                weeklyData={metrics?.strategies[s.strategyId]}
              />
            ))}
          </Grid>
        </Box>
        <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
          <Heading size="md" mb={2}>
            Goal Completion %
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(auto-fill, minmax(500px,1fr))' }} gap={4}>
            {goals.map((g) => (
              <GoalSummaryCard key={g.id} goal={g} weeklyData={metrics?.goals[g.id]} />
            ))}
          </Grid>
        </Box>
        <Box bg="white" p={4} borderRadius="md" boxShadow="sm" className="hidden md:block">
          <Heading size="md" mb={2}>
            Completion Heatmap
          </Heading>
          <DoneHeatmap
            strategies={uniqueStrategies}
            done={done}
            weeklyPercentages={metrics?.strategies}
          />
        </Box>
        {/* <Box>
          <Heading size="md" mb={2}>
            Burn Up
          </Heading>
          <BurnUpChart data={cumulative} />
        </Box> */}
        {/* <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
          <Heading size="md" mb={2}>
            Streaks
          </Heading>
          <StreakGanttChart strategies={uniqueStrategies} done={done} />
        </Box> */}
        {/* <Box>
          <Heading size="md" mb={2}>
            Compliance Radar
          </Heading>
          <ComplianceRadarChart strategies={uniqueStrategies} metrics={strategyMetrics} />
        </Box> */}
      </Stack>
    </Container>
  )
}
