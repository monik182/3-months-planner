import { usePlanContext } from '@/app/providers/usePlanContext'
import { getCurrentWeekFromStartDate } from '@/app/util'
import { Tag } from '@/components/ui/tag'
import { Text } from '@chakra-ui/react'
import { LuCalendarClock } from 'react-icons/lu'

export function WeekIndicator() {
  const { plan } = usePlanContext()
  
  if (!plan?.startDate) return null
  
  const currentWeek = getCurrentWeekFromStartDate(plan.startDate)
  const hasNotStarted = currentWeek <= 0
  const week = hasNotStarted ? 0 : currentWeek

  return (
    <Tag
      startElement={<LuCalendarClock />}
      colorPalette={hasNotStarted ? "gray" : "yellow"}
      variant="subtle"
      size={{ base: "sm", md: "md" }}
    >
      <Text fontSize={{ base: "xs", md: "sm" }}>
        Week {week}/12
      </Text>
    </Tag>
  )
}