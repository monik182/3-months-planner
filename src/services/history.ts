import { createGoalHistoryList, createIndicatorHistoryList, createStrategyHistoryList } from '@/app/util'
import { goalHandler, goalHistoryHandler, indicatorHandler, indicatorHistoryHandler, strategyHandler, strategyHistoryHandler } from '@/db/dexieHandler'
import { GoalHistoryNoGoalArraySchema } from '@/lib/validators/goalHistory'
import { IndicatorHistoryNoIndicatorArraySchema } from '@/lib/validators/indicatorHistory'
import { StrategyHistoryNoStrategyArraySchema } from '@/lib/validators/strategyHistory'
import { Goal, GoalHistory, IndicatorHistory, StrategyHistory } from '@prisma/client'
import { SyncService } from '@/services/sync'
import { QueueEntityType, QueueOperation } from '@/app/types/types'

interface HistoryData {
  goalHistory: GoalHistory[]
  strategiesHistory: StrategyHistory[]
  indicatorsHistory: IndicatorHistory[]
}

const create = async (planId: string): Promise<HistoryData> => {
  try {
    const data = await parseData(planId)
    const { goalHistory, strategiesHistory, indicatorsHistory } = data

    await Promise.all([
      goalHistoryHandler.createMany(goalHistory),
      strategyHistoryHandler.createMany(strategiesHistory),
      indicatorHistoryHandler.createMany(indicatorsHistory),
    ])

    const queuePromises = [
      SyncService.queueForSync(QueueEntityType.GOAL_HISTORY_BULK, 'bulk', QueueOperation.CREATE, goalHistory),
      SyncService.queueForSync(QueueEntityType.STRATEGY_HISTORY_BULK, 'bulk', QueueOperation.CREATE, strategiesHistory),
      SyncService.queueForSync(QueueEntityType.INDICATOR_HISTORY_BULK, 'bulk', QueueOperation.CREATE, indicatorsHistory),
    ]

    await Promise.all(queuePromises)

    return data
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
