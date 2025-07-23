"use client";
import { Box, Flex, Heading, Spinner, Text } from '@chakra-ui/react'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { useDashboardContext } from '@/app/dashboard/dashboardContext'
import { calculateWeekEndDate, calculateWeekStartDate, formatDate, getCurrentWeekFromStartDate } from '@/app/util'
interface CurrentWeekSummaryProps {
  weekNumber: number
}

export default function CurrentWeekSummary({ weekNumber }: CurrentWeekSummaryProps) {
  const { plan } = usePlanContext()
  const { weeklyScores, isRefetching } = useDashboardContext()

  if (!plan?.startDate) return null

  const startDate = calculateWeekStartDate(plan.startDate, weekNumber)
  const endDate = calculateWeekEndDate(startDate)
  const score = weeklyScores[weekNumber - 1] || 0

  return (
    <Flex justify="space-between" align="center" mb={4}>
      <Box>
        <Heading size="md">Week {weekNumber}</Heading>
        <Text fontSize="sm">{formatDate(startDate)} - {formatDate(endDate)}</Text>
      </Box>
      <Text fontSize="md">
        {isRefetching ? <Spinner size="xs" /> : score}/100%
      </Text>
    </Flex>
  )
}
