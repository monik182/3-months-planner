'use client'
import { Box, Heading, Text, Stack } from '@chakra-ui/react'
import { StrategyHistoryExtended } from '@/app/types/types'
import { HabitLineChart } from './HabitLineChart'

interface StrategySummaryCardProps {
  strategy: StrategyHistoryExtended
  metrics: {
    complianceRate: number
    currentStreak: number
    longestStreak: number
  }
  weeklyData?: number[]
}

export function StrategySummaryCard({ strategy, metrics, weeklyData }: StrategySummaryCardProps) {
  return (
    <Box borderWidth="1px" borderRadius="md" p={4}>
      <Stack gap={1}>
        <Heading size="sm">{strategy.strategy.content}</Heading>
        <Text>Compliance: {metrics.complianceRate.toFixed(0)}%</Text>
        <Text>Current Streak: {metrics.currentStreak}</Text>
        <Text>Longest Streak: {metrics.longestStreak}</Text>
        {weeklyData && <HabitLineChart data={weeklyData} height={150} />}
      </Stack>
    </Box>
  )
}
