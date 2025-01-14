import { GoalDetail } from '@/app/dashboard/Week/GoalDetail'
import { calculatePlanEndDate, calculateWeekStartDate, formatDate } from '@/app/util'
import { Heading } from '@chakra-ui/react'
import { Goal, Plan } from '@prisma/client'

interface WeekProps {
  seq: number
  goals: Goal[]
  plan: Plan
}
export function Week({ seq, goals, plan }: WeekProps) {
  console.log('goals', goals)
  
  const startDate = calculateWeekStartDate(plan.startDate, seq)
  const endDate = calculatePlanEndDate(startDate)

  return (
    <div>
      <div>

        <Heading>Week {seq}</Heading>
        {/* <p>future score...</p> */}
        <p>Week: {formatDate(startDate)} - {formatDate(endDate)}</p>
      </div>
      <div>
        {goals.map(g => (<GoalDetail key={g.id} goal={g} seq={seq} />))}
      </div>
    </div>
  )
}
