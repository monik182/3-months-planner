"use client";
import { HStack, Text, IconButton } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { calculateWeekStartDate, calculateWeekEndDate, formatDate } from '@/app/util'

export const getWeekLabel = (weekNumber: number, startDate: Date): string => {
  const weekStartDate = calculateWeekStartDate(startDate, weekNumber)
  const weekEndDate = calculateWeekEndDate(weekStartDate)
  return `${formatDate(weekStartDate, "MMM DD")} - ${formatDate(weekEndDate, "MMM DD")}`
}

interface WeekPaginationProps {
  activeWeek: number
  maxWeeks: number
  startDate: Date
  onChange: (week: number) => void
}

export default function WeekPagination({ activeWeek, maxWeeks, startDate, onChange }: WeekPaginationProps) {
  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && activeWeek > 1) {
      onChange(activeWeek - 1)
    }
    if (direction === 'next' && activeWeek < maxWeeks) {
      onChange(activeWeek + 1)
    }
  }

  const weekLabel = getWeekLabel(activeWeek, startDate)

  return (
    <HStack spacing={2} justify="center" my={4}>
      <IconButton
        aria-label="Previous week"
        variant="outline"
        size="sm"
        icon={<LuChevronLeft />}
        isDisabled={activeWeek <= 1}
        onClick={() => navigateWeek('prev')}
      />
      <Text fontSize="sm" fontWeight="medium">
        Week {activeWeek} ({weekLabel})
      </Text>
      <IconButton
        aria-label="Next week"
        variant="outline"
        size="sm"
        icon={<LuChevronRight />}
        isDisabled={activeWeek >= maxWeeks}
        onClick={() => navigateWeek('next')}
      />
    </HStack>
  )
}
