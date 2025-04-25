import { strategyHandler, strategyHistoryHandler } from '@/db/dexieHandler'
import { StrategyArraySchema, PartialStrategySchema, StrategyNoGoalSchema } from '@/lib/validators/strategy'
import { Strategy, Prisma } from '@prisma/client'
import { SyncService } from '@/services/sync'
import { Status } from '@/app/types/types'

const create = async (data: Strategy): Promise<Strategy> => {
  const parsedData = StrategyNoGoalSchema.parse(data)

  if (!SyncService.isEnabled) {
    await strategyHandler.create(parsedData)
    return parsedData
  }

  const response = await fetch('/api/strategy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create strategy')
  }

  await strategyHandler.create(parsedData)
  return parsedData
}

const createBulk = async (strategies: Strategy[]): Promise<Strategy[]> => {
  const parsedData = StrategyArraySchema.parse(strategies)

  if (!SyncService.isEnabled) {
    await strategyHandler.createMany(parsedData)
    return parsedData
  }

  const response = await fetch('/api/strategy/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create strategies')
  }

  await strategyHandler.createMany(parsedData)
  return parsedData
}

const get = async (id: string): Promise<Strategy | null> => {
  const strategy = await strategyHandler.findOne(id)
  if (strategy) {
    return strategy
  }

  if (!SyncService.isEnabled) {
    return null
  }

  const response = await fetch(`/api/strategy/${id}`)
  if (!response.ok) {
    console.error(`Failed to fetch strategy ${id} from remote:`, response.status)
    return null
  }

  const remoteStrategy = await response.json()
  try {
    await strategyHandler.create(remoteStrategy)
  } catch (error) {
    console.error('Error creating strategy:', error)
  }
  return remoteStrategy
}

const getByPlanId = async (planId: string, status = Status.ACTIVE): Promise<Strategy[]> => {
  const strategies = await strategyHandler.findMany({ planId, status })
  if (strategies?.length > 0) {
    return strategies
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const response = await fetch(`/api/strategy?planId=${planId}&status=${status}`)
  if (!response.ok) {
    return []
  }

  const remoteStrategies = await response.json()
  try {
    await strategyHandler.createMany(remoteStrategies)
  } catch (error) {
    console.error('Error creating strategies:', error)
  }
  return remoteStrategies
}

const getByGoalId = async (goalId: string, status = Status.ACTIVE): Promise<Strategy[]> => {
  const strategies = await strategyHandler.findMany({ goalId, status })
  if (strategies?.length > 0) {
    return strategies
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const response = await fetch(`/api/strategy?goalId=${goalId}&status=${status}`)
  if (!response.ok) {
    return []
  }

  const remoteStrategies = await response.json()
  try {
    await strategyHandler.createMany(remoteStrategies)
  } catch (error) {
    console.error('Error creating strategies:', error)
  }
  return remoteStrategies
}

const update = async (id: string, strategy: Prisma.StrategyUpdateInput): Promise<Partial<Strategy>> => {
  const parsedData = PartialStrategySchema.parse(strategy)

  if (!SyncService.isEnabled) {
    await strategyHandler.update(id, parsedData as Strategy)
    return { ...parsedData, id }
  }

  const response = await fetch(`/api/strategy/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update strategy')
  }

  await strategyHandler.update(id, parsedData)
  return parsedData
}

const deleteItem = async (id: string): Promise<void> => {
  await strategyHistoryHandler.deleteMany({ strategyId: id })
  await strategyHandler.delete(id)

  if (!SyncService.isEnabled) {
    return
  }

  const response = await fetch(`/api/strategy/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete strategy')
  }
}

export const StrategyService = {
  create,
  createBulk,
  get,
  getByPlanId,
  getByGoalId,
  update,
  deleteItem,
}
