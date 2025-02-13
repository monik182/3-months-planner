import { createGoalHistoryList, createIndicatorHistoryList, createStrategyHistoryList } from '@/app/util'
import { goalHandler, goalHistoryHandler, indicatorHandler, indicatorHistoryHandler, strategyHandler, strategyHistoryHandler } from '@/db/dexieHandler'
import { GoalHistoryArraySchema } from '@/lib/validators/goalHistory'
import { IndicatorHistoryArraySchema } from '@/lib/validators/indicatorHistory'
import { StrategyHistoryArraySchema } from '@/lib/validators/strategyHistory'

const ENABLE_CLOUD_SYNC = process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC

const create = async (planId: string) => {
  const response = await localCreate(planId).then(response => response.json())

  if (!ENABLE_CLOUD_SYNC) {
    return response
  }

  const body = JSON.stringify(response)
  return fetch(`/api/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
    .then(response => response.json())
}


export const HistoryService = {
  create,
}


async function localCreate(planId: string) {
  try {
    const goals = (await goalHandler.findMany({ planId })) || []
    const strategies = (await strategyHandler.findMany({ planId })) || []
    const indicators = (await indicatorHandler.findMany({ planId })) || []

    const goalHistory = GoalHistoryArraySchema.parse(createGoalHistoryList(planId, goals))
    const strategiesHistory = StrategyHistoryArraySchema.parse(createStrategyHistoryList(planId, strategies))
    const indicatorsHistory = IndicatorHistoryArraySchema.parse(createIndicatorHistoryList(planId, indicators))

    await Promise.all([
      goalHistoryHandler.createMany(goalHistory),
      strategyHistoryHandler.createMany(strategiesHistory),
      indicatorHistoryHandler.createMany(indicatorsHistory),
    ])

    return new Response(JSON.stringify({ goalHistory, strategiesHistory, indicatorsHistory }), { status: 200 })
  } catch (error) {
    console.error('Local storage history error:', error)
    return new Response(`Error processing request: ${error.message}`, { status: 500 })
  }
}
