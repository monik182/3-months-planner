import { goalHandler, strategyHandler, indicatorHandler, strategyHistoryHandler, indicatorHistoryHandler } from '@/db/dexieHandler'

export const cleanupOrphanedRecords = async () => {
  // Get all valid goals
  const goals = await goalHandler.findMany({})
  const validGoalIds = new Set(goals.map(g => g.id))

  // Clean up strategies
  const strategies = await strategyHandler.findMany({})
  for (const strategy of strategies) {
    if (!validGoalIds.has(strategy.goalId)) {
      await strategyHistoryHandler.deleteMany({ strategyId: strategy.id })
      await strategyHandler.delete(strategy.id)
    }
  }

  // Clean up indicators
  const indicators = await indicatorHandler.findMany({})
  for (const indicator of indicators) {
    if (!validGoalIds.has(indicator.goalId)) {
      await indicatorHistoryHandler.deleteMany({ indicatorId: indicator.id })
      await indicatorHandler.delete(indicator.id)
    }
  }
}