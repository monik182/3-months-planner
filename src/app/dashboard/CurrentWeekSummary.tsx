"use client";
import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { useDashboardContext } from '@/app/dashboard-legacy/dashboardContext'
import WeekPagination from '@/app/dashboard/WeekPagination';
interface CurrentWeekSummaryProps {
  activeWeek: number
  setActiveWeek: (week: number) => void
  disabled?: boolean
}

export default function CurrentWeekSummary({ activeWeek, setActiveWeek, disabled }: CurrentWeekSummaryProps) {
  const { plan } = usePlanContext()
  const { weeklyScores, isRefetching } = useDashboardContext()

  if (!plan?.startDate) return null

  const score = weeklyScores[activeWeek - 1] || 0

  return (
    <Flex justify="space-between" align="center" mb={4}>
      <Box>
        <WeekPagination
          activeWeek={activeWeek}
          startDate={plan?.startDate as Date}
          onChange={setActiveWeek}
          disabled={disabled}
        />
      </Box>
      <Text fontSize="md">
        {isRefetching ? <Spinner size="xs" /> : score}/100%
      </Text>
    </Flex>
  )
}
