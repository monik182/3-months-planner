import { strategyHandler } from '@/db/dexieHandler'
import { PartialStrategySchema, StrategySchema } from '@/lib/validators/strategy'
import { Prisma, Strategy } from '@prisma/client'

const ENABLE_CLOUD_SYNC = process.env.ENABLE_CLOUD_SYNC

const create = async (strategy: Prisma.StrategyCreateInput): Promise<Strategy> => {
  const parsedData = StrategySchema.parse(strategy)
  if (!ENABLE_CLOUD_SYNC) {
    await strategyHandler.create(parsedData)
    return parsedData
  }

  return fetch(`/api/strategy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategy),
  })
    .then(response => response.json())
    .then(async (response) => {
      await strategyHandler.create(parsedData)
      return response
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

  if (!ENABLE_CLOUD_SYNC) {
    await strategyHandler.update(id, parsedData)
    return parsedData as Strategy
  }

  return fetch(`/api/strategy/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategy),
  })
    .then(response => response.json())
    .then(async (response) => {
      await strategyHandler.update(id, parsedData)
      return response
    })
}

export const StrategyService = {
  create,
  get,
  getByPlanId,
  getByGoalId,
  update,
}
