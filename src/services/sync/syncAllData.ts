import { ENABLE_CLOUD_SYNC } from '@/app/constants'
import { QueueEntityType, QueueOperation } from '@/app/types/types'
import { goalHandler, goalHistoryHandler, indicatorHandler, indicatorHistoryHandler, planHandler, strategyHandler, strategyHistoryHandler } from '@/db/dexieHandler'
import { processSyncQueue } from '@/services/sync/processSyncQueue'
import { markUserAsSynced, queueForSync, validateUserExists } from '@/services/sync/shared'

export const syncAllData = async (userId: string, operation = QueueOperation.UPDATE): Promise<{
  success: boolean,
  error?: string
}> => {
  if (!ENABLE_CLOUD_SYNC) {
    return { success: true }
  }

  try {
    const userExists = await validateUserExists(userId)

    if (!userExists) {
      return {
        success: false,
        error: `User with ID ${userId} could not be created in the database`
      }
    }

    const plans = await planHandler.findAllByUserId(userId)

    for (const plan of plans) {
      await queueForSync(QueueEntityType.PLAN, plan.id, operation, plan)

      const goals = await goalHandler.findMany({ planId: plan.id })
      await queueForSync(QueueEntityType.GOAL_BULK, 'bulk', operation, goals)

      const strategies = await strategyHandler.findMany({ planId: plan.id })
      await queueForSync(QueueEntityType.STRATEGY_BULK, 'bulk', operation, strategies)

      const indicators = await indicatorHandler.findMany({ planId: plan.id })
      await queueForSync(QueueEntityType.INDICATOR_BULK, 'bulk', operation, indicators)

      const goalHistory = await goalHistoryHandler.findMany({ planId: plan.id })
      await queueForSync(QueueEntityType.GOAL_HISTORY_BULK, 'bulk', operation, goalHistory)

      const strategyHistory = await strategyHistoryHandler.findMany({ planId: plan.id })
      await queueForSync(QueueEntityType.STRATEGY_HISTORY_BULK, 'bulk', operation, strategyHistory)

      const indicatorHistory = await indicatorHistoryHandler.findMany({ planId: plan.id })
      await queueForSync(QueueEntityType.INDICATOR_HISTORY_BULK, 'bulk', operation, indicatorHistory)
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
