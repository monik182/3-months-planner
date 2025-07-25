import { createGoalHistoryList, createIndicatorHistoryList, createStrategyHistoryList } from '@/app/util'
import { GoalHistoryNoGoalArraySchema } from '@/lib/validators/goalHistory'
import { IndicatorHistoryNoIndicatorArraySchema } from '@/lib/validators/indicatorHistory'
import { StrategyHistoryNoStrategyArraySchema } from '@/lib/validators/strategyHistory'
import { GoalService } from '@/services/goal'
import { IndicatorService } from '@/services/indicator'
import { StrategyService } from '@/services/strategy'
import { Goal, GoalHistory, IndicatorHistory, StrategyHistory } from '@prisma/client'

interface HistoryData {
  goalHistory: GoalHistory[]
  strategiesHistory: StrategyHistory[]
  indicatorsHistory: IndicatorHistory[]
}

const create = async (planId: string): Promise<HistoryData> => {
  try {
    const data = await parseData(planId)
    const { goalHistory, strategiesHistory, indicatorsHistory } = data

    const response = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, ...data }),
    })

    if (!response.ok) {
      throw new Error('Failed to create history')
    }

    return { goalHistory, strategiesHistory, indicatorsHistory }
  } catch (error) {
    console.error('Error creating history snapshot:', error)
    throw error
  }
}

export const HistoryService = {
  create,
}

async function parseData(planId: string): Promise<HistoryData> {
  const goals = await GoalService.getByPlanId(planId)
  const strategies = await StrategyService.getByPlanId(planId)
  const indicators = await IndicatorService.getByPlanId(planId)

  const goalHistory = GoalHistoryNoGoalArraySchema.parse(createGoalHistoryList(planId, goals as Goal[]))
  const strategiesHistory = StrategyHistoryNoStrategyArraySchema.parse(createStrategyHistoryList(planId, strategies))
  const indicatorsHistory = IndicatorHistoryNoIndicatorArraySchema.parse(createIndicatorHistoryList(planId, indicators))

  return {
    goalHistory,
    strategiesHistory,
    indicatorsHistory
  }
}
