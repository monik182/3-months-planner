"use client";
import { HStack, Text, IconButton } from '@chakra-ui/react'
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
}

export default function WeekPagination({ activeWeek, startDate, onChange }: WeekPaginationProps) {
  const navigateWeek = (direction: 'prev' | 'next') => {
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
        disabled={activeWeek <= 1}
        onClick={() => navigateWeek('prev')}
      >
        <LuChevronLeft />
      </IconButton>
      <Text fontSize="sm" fontWeight="medium">
        Week {activeWeek} ({weekLabel})
      </Text>
      <IconButton
        aria-label="Next week"
        variant="outline"
        size="sm"
        disabled={activeWeek >= MAX_WEEKS}
        onClick={() => navigateWeek('next')}
      >
        <LuChevronRight />
      </IconButton>
    </HStack>
  )
}
