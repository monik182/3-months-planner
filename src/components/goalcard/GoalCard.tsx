import WeekProgressIndicator from './WeekProgressIndicator';
import { Box, Badge, Button, Card, CardBody, CardHeader, Flex, Heading, Text } from '@chakra-ui/react'

export interface GoalAction {
  id: string
  name: string
  completedDays: Record<string, boolean>
}

export interface Goal {
  id: string
  createdAt: string
  title: string
  description?: string
  actions: GoalAction[]
}

interface GoalCardProps {
  goal: Goal
  today: string
  totalWeeks: number
  onToggleDay: (goalId: string, actionId: string, day: string) => void
}

export default function GoalCard({ goal, today, totalWeeks, onToggleDay }: GoalCardProps) {
  const startDate = new Date(goal.createdAt)

  const getDatesForLastWeek = () => {
    const dates: string[] = []
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }

    return dates
  }

  const lastWeekDates = getDatesForLastWeek()

  const getTotalCompletedDays = () => {
    return goal.actions.reduce((total, action) => {
      return total + Object.values(action.completedDays).filter(Boolean).length
    }, 0)
  }

  const calculateCompletionPercentage = () => {
    const totalDaysSinceStart = Math.min(
      Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      totalWeeks * 7
    )
    const totalPossibleCompletions = totalDaysSinceStart * goal.actions.length

    if (totalPossibleCompletions === 0) return 0

    const completedDays = getTotalCompletedDays()
    return Math.round((completedDays / totalPossibleCompletions) * 100)
  }

  return (
    <Card>
      <CardHeader pb={2} display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Heading size="md">{goal.title}</Heading>
          {goal.description && <Text fontSize="sm" color="gray.600">{goal.description}</Text>}
        </Box>
      </CardHeader>
      <CardBody pt={4}>
        <Box mb={5}>
          <WeekProgressIndicator
            startDate={startDate}
            totalWeeks={totalWeeks}
            completionPercentage={calculateCompletionPercentage()}
          />
        </Box>
        <Box display="flex" flexDirection="column" gap={6}>
          {goal.actions.map((action) => {
            const completed = Object.values(action.completedDays).filter(Boolean).length
            const total = Object.keys(action.completedDays).length
            return (
              <Box key={action.id} display="flex" flexDirection="column" gap={2}>
                <Flex justify="space-between" align="center">
                  <Heading as="h4" size="sm">{action.name}</Heading>
                  <Badge borderRadius="full" px={2} py={1} fontSize="xs" bg="gray.100">
                    {Math.round((completed / total) * 100) || 0}% complete
                  </Badge>
                </Flex>
                <Flex flexWrap="wrap" gap={2}>
                  {lastWeekDates.map((date) => {
                    const isToday = date === today
                    const isCompleted = action.completedDays[date]
                    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date).getDay()]

                    return (
                      <Box key={date} display="flex" flexDirection="column" alignItems="center" gap={1}>
                        <Text fontSize="xs" color="gray.500">{dayName}</Text>
                        <Button
                          onClick={() => onToggleDay(goal.id, action.id, date)}
                          size="xs"
                          variant={isCompleted ? 'solid' : 'outline'}
                          colorScheme={isCompleted ? 'green' : 'gray'}
                          borderRadius="full"
                          p={0}
                          minW="24px"
                          h="24px"
                          aria-label={`${isCompleted ? 'Mark as incomplete' : 'Mark as complete'} for ${dayName}`}
                        >
                          {isCompleted && '✓'}
                        </Button>
                      </Box>
                    )
                  })}
                </Flex>
              </Box>
            )
          })}
        </Box>
      </CardBody>
    </Card>
  )
}

