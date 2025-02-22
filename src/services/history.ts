import { createGoalHistoryList, createIndicatorHistoryList, createStrategyHistoryList } from '@/app/util'
import { goalHandler, goalHistoryHandler, indicatorHandler, indicatorHistoryHandler, strategyHandler, strategyHistoryHandler } from '@/db/dexieHandler'
import { GoalHistoryNoGoalArraySchema } from '@/lib/validators/goalHistory'
import { IndicatorHistoryNoIndicatorArraySchema } from '@/lib/validators/indicatorHistory'
import { StrategyHistoryNoStrategyArraySchema } from '@/lib/validators/strategyHistory'
import { Goal, GoalHistory, IndicatorHistory, StrategyHistory } from '@prisma/client'

const ENABLE_CLOUD_SYNC = JSON.parse(process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC || '')

const create = async (planId: string) => {
  const data = await parseData(planId)
  const { goalHistory, strategiesHistory, indicatorsHistory } = data

  if (!ENABLE_CLOUD_SYNC) {
    await Promise.all([
      goalHistoryHandler.createMany(goalHistory),
      strategyHistoryHandler.createMany(strategiesHistory),
      indicatorHistoryHandler.createMany(indicatorsHistory),
    ])
    return data
  }

  const body = JSON.stringify(data)
  return fetch(`/api/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
    .then(async (response) => {
      if (!response.ok) {
        const res = await response.json()
        throw new Error(JSON.stringify(res.error) || 'Failed to create indicator')
      }
      await Promise.all([
        goalHistoryHandler.createMany(goalHistory),
        strategyHistoryHandler.createMany(strategiesHistory),
        indicatorHistoryHandler.createMany(indicatorsHistory),
      ])
      return data
    })
}


export const HistoryService = {
  create,
}


async function parseData(planId: string): Promise<{ goalHistory: GoalHistory[], strategiesHistory: StrategyHistory[], indicatorsHistory: IndicatorHistory[] }> {
  const goals = (await goalHandler.findMany({ planId })) || []
  const strategies = (await strategyHandler.findMany({ planId })) || []
  const indicators = (await indicatorHandler.findMany({ planId })) || []

  const goalHistory = GoalHistoryNoGoalArraySchema.parse(createGoalHistoryList(planId, goals as Goal[]))
  const strategiesHistory = StrategyHistoryNoStrategyArraySchema.parse(createStrategyHistoryList(planId, strategies))
  const indicatorsHistory = IndicatorHistoryNoIndicatorArraySchema.parse(createIndicatorHistoryList(planId, indicators))

  return { goalHistory, strategiesHistory, indicatorsHistory }
}
