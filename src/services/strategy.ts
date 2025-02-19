import { strategyHandler } from '@/db/dexieHandler'
import { PartialStrategySchema } from '@/lib/validators/strategy'
import { Prisma, Strategy } from '@prisma/client'

const ENABLE_CLOUD_SYNC = process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC

const create = async (strategy: Strategy): Promise<Strategy> => {

  if (!ENABLE_CLOUD_SYNC) {
    await strategyHandler.create(strategy)
    return strategy
  }
  return fetch(`/api/strategy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategy),
  })
    .then(async (response) => {
      if (!response.ok) {
        const res = await response.json()
        throw new Error(JSON.stringify(res.error) || 'Failed to create strategy')
      }
      await strategyHandler.create(strategy)
      return strategy
    })
}

const get = async (id: string): Promise<Strategy | null> => {
  const strategy = await strategyHandler.findOne(id)

  if (strategy) {
    return strategy
  }

  if (!ENABLE_CLOUD_SYNC) {
    return null
  }

  return fetch(`/api/strategy/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string): Promise<Strategy[]> => {
  const strategies = await strategyHandler.findMany({ planId })

  if (strategies) {
    return strategies
  }

  if (!ENABLE_CLOUD_SYNC) {
    return []
  }

  return fetch(`/api/strategy?planId=${planId}`).then(response => response.json())
}

const getByGoalId = async (goalId: string): Promise<Strategy[]> => {
  const strategies = await strategyHandler.findMany({ goalId })

  if (strategies) {
    return strategies
  }

  if (!ENABLE_CLOUD_SYNC) {
    return []
  }

  return fetch(`/api/strategy?goalId=${goalId}`).then(response => response.json())
}

const update = async (id: string, strategy: Prisma.IndicatorUpdateInput): Promise<Strategy> => {
  const parsedData = PartialStrategySchema.parse(strategy)
  await strategyHandler.update(id, parsedData)

  if (!ENABLE_CLOUD_SYNC) {
    return parsedData as Strategy
  }

  return fetch(`/api/strategy/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })
    .then(response => response.json())
}

const deleteItem = async (id: string): Promise<Strategy> => {
  await strategyHandler.delete(id)

  if (!ENABLE_CLOUD_SYNC) {
    return { id } as Strategy
  }

  return fetch(`/api/strategy/${id}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
}

export const StrategyService = {
  create,
  get,
  getByPlanId,
  getByGoalId,
  update,
  deleteItem,
}
