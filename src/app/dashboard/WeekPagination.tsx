"use client";
import { HStack, Text, IconButton, Heading, Box } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { calculateWeekStartDate, calculateWeekEndDate, formatDate } from '@/app/util'

export const getWeekLabel = (weekNumber: number, startDate: Date): string => {
  const weekStartDate = calculateWeekStartDate(startDate, weekNumber)
  const weekEndDate = calculateWeekEndDate(weekStartDate)
  return `${formatDate(weekStartDate, "MMM DD")} - ${formatDate(weekEndDate, "MMM DD")}`
}

const MAX_WEEKS = 12

interface WeekPaginationProps {
  activeWeek: number
  startDate: Date
  onChange: (week: number) => void
  disabled?: boolean
}

export default function WeekPagination({ activeWeek, startDate, onChange, disabled }: WeekPaginationProps) {
  const navigateWeek = (direction: 'prev' | 'next') => {
    if (disabled) return
    if (direction === 'prev' && activeWeek > 1) {
      onChange(activeWeek - 1)
    }
    if (direction === 'next' && activeWeek < MAX_WEEKS) {
      onChange(activeWeek + 1)
    }
  }

  const weekLabel = getWeekLabel(activeWeek, startDate)

  return (
    <HStack gap={2} justify="center" my={4}>
      <IconButton
        aria-label="Previous week"
        variant="outline"
        size="sm"
        disabled={disabled || activeWeek <= 1}
        onClick={() => navigateWeek('prev')}
      >
        <LuChevronLeft />
      </IconButton>
      <Box textAlign="center">
        <Heading size="md">Week {activeWeek}</Heading>
        <Text fontSize="sm">{weekLabel}</Text>
      </Box>
      <IconButton
        aria-label="Next week"
        variant="outline"
        size="sm"
        disabled={disabled || activeWeek >= MAX_WEEKS}
        onClick={() => navigateWeek('next')}
      >
        <LuChevronRight />
      </IconButton>
    </HStack>
  )
}
