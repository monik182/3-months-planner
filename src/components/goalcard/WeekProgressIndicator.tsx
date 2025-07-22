import { useEffect, useState } from 'react';
import { Box, Flex, Progress, Text, VStack } from '@chakra-ui/react';

export interface WeekProgressIndicatorProps {
  startDate: Date
  totalWeeks: number
  completionPercentage: number
}

export default function WeekProgressIndicator({
  startDate,
  totalWeeks,
  completionPercentage,
}: WeekProgressIndicatorProps) {
  const [currentWeek, setCurrentWeek] = useState(1)

  useEffect(() => {
    const calculateCurrentWeek = () => {
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const week = Math.min(Math.floor(diffDays / 7) + 1, totalWeeks)
      setCurrentWeek(week)
    }

    calculateCurrentWeek()
  }, [startDate, totalWeeks])

  return (
    <VStack spacing={1} align="stretch">
      <Flex justify="space-between" fontSize="sm">
        <Text fontWeight="medium">{completionPercentage}% complete</Text>
      </Flex>
      <Progress value={completionPercentage} height={2} borderRadius="sm" />
      <Flex justify="space-between" pt={1} fontSize="xs" color="gray.500">
        <Text>Start</Text>
        <Text>End</Text>
      </Flex>
    </VStack>
  )
}

