import { StepLayout } from '../stepLayout'
import { Step } from '@/app/types/types'
import { Spinner } from '@chakra-ui/react'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { Plan } from '@prisma/client'
import PlanViewer from '@/components/PlanViewer'

export function Step4({ }: Step<Plan>) {
  const { plan, goalActions, strategyActions, indicatorActions } = usePlanContext()
  const { isLoading: loadingGoals } = goalActions.useGetByPlanId(plan?.id as string)
  const { isLoading: loadingStrategies } = strategyActions.useGetByPlanId(plan?.id as string)
  const { isLoading: loadingIndicators } = indicatorActions.useGetByPlanId(plan?.id as string)
  const loading = loadingGoals || loadingStrategies || loadingIndicators

  if (loading) {
    return (
      <Spinner />
    )
  }

  return (
    <StepLayout
      title="Review & Reflect"
      description="This is a chance to review everything you’ve outlined so far—your vision, goals, and strategies—and ensure they align with your priorities and timeline. Take a moment to reflect and adjust if needed before you commit to taking the first step."
    >
      <PlanViewer />
    </StepLayout>
  )
}
