'use client'
import { Box, Heading, Text, Stack } from '@chakra-ui/react'
import { HabitLineChart } from './HabitLineChart'

interface GoalSummaryCardProps {
  goal: { id: string; content: string }
  weeklyData?: number[]
}

export function GoalSummaryCard({ goal, weeklyData }: GoalSummaryCardProps) {
  const average = weeklyData && weeklyData.length
    ? weeklyData.reduce((a, b) => a + b, 0) / weeklyData.length
    : 0
  return (
    <Box borderWidth="1px" borderRadius="md" p={4}>
      <Stack gap={1}>
        <Heading size="sm">{goal.content}</Heading>
        {weeklyData && <Text>Average Score: {average.toFixed(0)}%</Text>}
        {weeklyData && <HabitLineChart data={weeklyData} height={150} />}
      </Stack>
    </Box>
  )
}
