import { ENABLE_CLOUD_SYNC } from '@/app/constants'
import { QueueEntityType, QueueOperation } from '@/app/types/types'
import { goalHandler, goalHistoryHandler, indicatorHandler, indicatorHistoryHandler, planHandler, strategyHandler, strategyHistoryHandler } from '@/db/dexieHandler'
import { processSyncQueue } from '@/services/sync/processSyncQueue'
import { markUserAsSynced, queueForSync } from '@/services/sync/shared'

export const syncAllData = async (userId: string, operation = QueueOperation.UPDATE): Promise<{
  success: boolean,
  error?: string
}> => {
  if (!ENABLE_CLOUD_SYNC) {
    return { success: true }
  }

  try {

    const plans = await planHandler.findAllByUserId(userId)

    for (const plan of plans) {
      await queueForSync(QueueEntityType.PLAN, plan.id, operation, plan)

      // Get all valid goals for this plan
      const goals = await goalHandler.findMany({ planId: plan.id })
      const validGoalIds = new Set(goals.map(g => g.id))
      await queueForSync(QueueEntityType.GOAL_BULK, 'bulk', operation, goals)

      // Filter strategies to only include those with valid goals
      const allStrategies = await strategyHandler.findMany({ planId: plan.id })
      const validStrategies = allStrategies.filter(s => validGoalIds.has(s.goalId))
      await queueForSync(QueueEntityType.STRATEGY_BULK, 'bulk', operation, validStrategies)

      // Filter indicators to only include those with valid goals
      const allIndicators = await indicatorHandler.findMany({ planId: plan.id })
      const validIndicators = allIndicators.filter(i => validGoalIds.has(i.goalId))
      await queueForSync(QueueEntityType.INDICATOR_BULK, 'bulk', operation, validIndicators)

      // Filter histories to only include those with valid parents
      const validStrategyIds = new Set(validStrategies.map(s => s.id))
      const validIndicatorIds = new Set(validIndicators.map(i => i.id))

      const allStrategyHistory = await strategyHistoryHandler.findMany({ planId: plan.id })
      const validStrategyHistory = allStrategyHistory.filter(sh => !!sh && validStrategyIds.has(sh.strategyId))
      await queueForSync(QueueEntityType.STRATEGY_HISTORY_BULK, 'bulk', operation, validStrategyHistory)

      const allIndicatorHistory = await indicatorHistoryHandler.findMany({ planId: plan.id })
      const validIndicatorHistory = allIndicatorHistory.filter(ih => ih && validIndicatorIds.has(ih.indicatorId))
      await queueForSync(QueueEntityType.INDICATOR_HISTORY_BULK, 'bulk', operation, validIndicatorHistory)

      // Goal history is already handled by cascade delete
      const goalHistory = await goalHistoryHandler.findMany({ planId: plan.id })
      await queueForSync(QueueEntityType.GOAL_HISTORY_BULK, 'bulk', operation, goalHistory)
    }

    await processSyncQueue()
    await markUserAsSynced(userId)

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
