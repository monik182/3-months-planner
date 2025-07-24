'use client'
import { Box, Heading, Text, Stack } from '@chakra-ui/react'
import type { Strategy } from '@/app/tracker/types'

interface StrategySummaryCardProps {
  strategy: Strategy
  metrics: {
    complianceRate: number
    currentStreak: number
    longestStreak: number
  }
}

export function StrategySummaryCard({ strategy, metrics }: StrategySummaryCardProps) {
  return (
    <Box borderWidth="1px" borderRadius="md" p={4}>
      <Stack spacing={1}>
        <Heading size="sm">{strategy.content}</Heading>
        <Text>Compliance: {metrics.complianceRate.toFixed(0)}%</Text>
        <Text>Current Streak: {metrics.currentStreak}</Text>
        <Text>Longest Streak: {metrics.longestStreak}</Text>
      </Stack>
    </Box>
  )
}
