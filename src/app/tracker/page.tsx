'use client'
import { Container, Heading, Grid, Stack, Box } from '@chakra-ui/react'
import { StrategySummaryCard } from '@/components/tracker/StrategySummaryCard'
import { WeeklyBarChart } from '@/components/tracker/WeeklyBarChart'
import { HabitLineChart } from '@/components/tracker/HabitLineChart'
import { DoneHeatmap } from '@/components/tracker/DoneHeatmap'
import { BurnUpChart } from '@/components/tracker/BurnUpChart'
import { StreakGanttChart } from '@/components/tracker/StreakGanttChart'
import { ComplianceRadarChart } from '@/components/tracker/ComplianceRadarChart'
import type { Goal, Strategy, StrategyHistory, TrackerData } from './types'

// Helper: compute done flags per strategy
export function computeDoneFlags(data: TrackerData): Record<string, number[]> {
  const result: Record<string, number[]> = {}
  data.goals.forEach((g) => {
    g.strategies.forEach((s) => {
      result[s.id] = Array(12).fill(0)
    })
  })
  data.history.forEach((h) => {
    if (h.sequence >= 1 && h.sequence <= 12) {
      if (!result[h.strategyId]) {
        result[h.strategyId] = Array(12).fill(0)
      }
      result[h.strategyId][h.sequence - 1] = h.completed ? 1 : 0
    }
  })
  return result
}

// Helper: compute metrics per strategy
export function computeStrategyMetrics(done: Record<string, number[]>) {
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
export function computeWeekMetrics(done: Record<string, number[]>) {
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

interface TrackerPageProps {
  data: TrackerData
  title?: string
}

export default function TrackerPage({ data, title = 'Habit Tracker' }: TrackerPageProps) {
  const done = computeDoneFlags(data)
  const strategyMetrics = computeStrategyMetrics(done)
  const weekMetrics = computeWeekMetrics(done)
  const cumulative = weekMetrics.weeklyWinCount.reduce<number[]>((acc, v, idx) => {
    acc[idx] = (acc[idx - 1] || 0) + v
    return acc
  }, [])
  const strategies: Strategy[] = data.goals.flatMap((g) => g.strategies)

  return (
    <Container maxW="6xl" py={8}>
      <Heading mb={4}>{title}</Heading>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(auto-fill, minmax(250px,1fr))' }} gap={4}>
        {strategies.map((s) => (
          <StrategySummaryCard key={s.id} strategy={s} metrics={strategyMetrics[s.id]} />
        ))}
      </Grid>
      <Stack spacing={8} mt={8}>
        <Box>
          <Heading size="md" mb={2}>
            Weekly Wins
          </Heading>
          <WeeklyBarChart data={weekMetrics.weeklyWinCount} />
        </Box>
        <Box>
          <Heading size="md" mb={2}>
            Habit Completion %
          </Heading>
          <HabitLineChart data={weekMetrics.habitPercent} />
        </Box>
        <Box>
          <Heading size="md" mb={2}>
            Completion Heatmap
          </Heading>
          <DoneHeatmap strategies={strategies} done={done} />
        </Box>
        <Box>
          <Heading size="md" mb={2}>
            Burn Up
          </Heading>
          <BurnUpChart data={cumulative} />
        </Box>
        <Box>
          <Heading size="md" mb={2}>
            Streaks
          </Heading>
          <StreakGanttChart strategies={strategies} done={done} />
        </Box>
        <Box>
          <Heading size="md" mb={2}>
            Compliance Radar
          </Heading>
          <ComplianceRadarChart strategies={strategies} metrics={strategyMetrics} />
        </Box>
      </Stack>
    </Container>
  )
}
