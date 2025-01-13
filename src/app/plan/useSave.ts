import { usePlanContext } from '@/app/providers/usePlanContext'
import { toaster } from '@/components/ui/toaster'
import { PlanService } from '@/services/plan'
import { useState } from 'react'

export function useSave() {
  const [isLoading, setIsLoading] = useState(false)
  const { plan } = usePlanContext()

  const handleSavePlan = async () => {
    setIsLoading(true)
    try {
      const data = {
        plan: plan.plan,
        goals: plan.goals,
        strategies: plan.strategies,
        indicators: plan.indicators,
      }

      const response = await PlanService.create(data)

      if (!response || response.error) {
        toaster.create({
          title: response?.message || 'Invalid response from the server',
          type: 'error',
        })
        return
      }

      return response
    } catch (error) {
      toaster.create({
        title: (error as unknown)?.message,
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { handleSavePlan, isLoading }
}
