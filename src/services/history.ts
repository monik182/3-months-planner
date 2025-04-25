import { createGoalHistoryList, createIndicatorHistoryList, createStrategyHistoryList } from '@/app/util'
import { goalHandler, goalHistoryHandler, indicatorHandler, indicatorHistoryHandler, strategyHandler, strategyHistoryHandler } from '@/db/dexieHandler'
import { GoalHistoryNoGoalArraySchema } from '@/lib/validators/goalHistory'
import { IndicatorHistoryNoIndicatorArraySchema } from '@/lib/validators/indicatorHistory'
import { StrategyHistoryNoStrategyArraySchema } from '@/lib/validators/strategyHistory'
import { Goal, GoalHistory, IndicatorHistory, StrategyHistory } from '@prisma/client'
import { SyncService } from '@/services/sync'

interface HistoryData {
  goalHistory: GoalHistory[]
  strategiesHistory: StrategyHistory[]
  indicatorsHistory: IndicatorHistory[]
}

const create = async (planId: string): Promise<HistoryData> => {
  try {
    const data = await parseData(planId)
    const { goalHistory, strategiesHistory, indicatorsHistory } = data

    if (!SyncService.isEnabled) {
      await Promise.all([
        goalHistoryHandler.createMany(goalHistory),
        strategyHistoryHandler.createMany(strategiesHistory),
        indicatorHistoryHandler.createMany(indicatorsHistory),
      ])
      return data
    }

    const response = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, ...data }),
    })

    if (!response.ok) {
      throw new Error('Failed to create history')
    }

    await Promise.all([
      goalHistoryHandler.createMany(goalHistory),
      strategyHistoryHandler.createMany(strategiesHistory),
      indicatorHistoryHandler.createMany(indicatorsHistory),
    ])

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
  const goals = (await goalHandler.findMany({ planId })) || []
  const strategies = (await strategyHandler.findMany({ planId })) || []
  const indicators = (await indicatorHandler.findMany({ planId })) || []

  const goalHistory = GoalHistoryNoGoalArraySchema.parse(createGoalHistoryList(planId, goals as Goal[]))
  const strategiesHistory = StrategyHistoryNoStrategyArraySchema.parse(createStrategyHistoryList(planId, strategies))
  const indicatorsHistory = IndicatorHistoryNoIndicatorArraySchema.parse(createIndicatorHistoryList(planId, indicators))

  return { goalHistory, strategiesHistory, indicatorsHistory }
}
