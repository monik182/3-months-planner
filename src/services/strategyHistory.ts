import { strategyHistoryHandler } from '@/db/dexieHandler'
import { StrategyHistoryExtended } from '@/app/types/types'
import { Prisma, StrategyHistory } from '@prisma/client'
import { PartialStrategyHistorySchema, StrategyHistorySchema } from '@/lib/validators/strategyHistory'

const ENABLE_CLOUD_SYNC = JSON.parse(process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC || '')

const create = async (strategy: Prisma.StrategyHistoryCreateInput): Promise<StrategyHistory> => {
  const parsedData = StrategyHistorySchema.parse(strategy)
  await strategyHistoryHandler.create(parsedData)

  if (!ENABLE_CLOUD_SYNC) {
    return parsedData
  }

  return fetch(`/api/strategy/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })
    .then(response => response.json())
}

const get = async (id: string): Promise<StrategyHistory | null> => {
  const history = await strategyHistoryHandler.findOne(id)
  if (history) {
    return history
  }

  if (!ENABLE_CLOUD_SYNC) {
    return null
  }

  return fetch(`/api/strategy/history/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string, sequence?: string, status?: string): Promise<StrategyHistoryExtended[]> => {
  const history = await strategyHistoryHandler.findMany({ planId, status }, {}, sequence)
  if (history) {
    return history as StrategyHistoryExtended[]
  }

  if (!ENABLE_CLOUD_SYNC) {
    return []
  }

  return fetch(`/api/strategy/history?planId=${planId}&sequence=${sequence}&status=${status}`).then(response => response.json())
}

const getByGoalId = async (goalId: string, sequence?: number, status?: string): Promise<StrategyHistoryExtended[]> => {
  const history = await strategyHistoryHandler.findManyByGoalId({ goalId, status }, { sequence })
  if (history) {
    return history as StrategyHistoryExtended[]
  }

  if (!ENABLE_CLOUD_SYNC) {
    return []
  }

  return fetch(`/api/strategy/history?goalId=${goalId}&sequence=${sequence}&status=${status}`).then(response => response.json())
}

const update = async (id: string, strategy: Prisma.StrategyHistoryUpdateInput): Promise<StrategyHistory> => {
  const parsedData = PartialStrategyHistorySchema.parse(strategy)
  await strategyHistoryHandler.update(id, parsedData)

  if (!ENABLE_CLOUD_SYNC) {
    return strategy as StrategyHistory
  }

  return fetch(`/api/strategy/history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategy),
  })
    .then(response => response.json())
}

export const StrategyHistoryService = {
  create,
  get,
  getByPlanId,
  getByGoalId,
  update,
}
