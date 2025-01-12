import { usePlanContext } from '@/app/providers/usePlanContext'

export function useSave() {
  const { planHistory } = usePlanContext()

  const handleSavePlan = () => {
    console.log('******************** SAVING PLAN')
    console.log(planHistory.goals)
    console.log(planHistory.strategies)
    console.log(planHistory.indicators)
    console.log('******************** SAVING PLAN *****************')
  }

  return { handleSavePlan }
}