import { StrategyArraySchema, PartialStrategySchema, StrategyNoGoalSchema } from '@/lib/validators/strategy'
import { Strategy, Prisma } from '@prisma/client'
import { Status } from '@/app/types/types'
import { getCachedData, setCachedData } from '@/lib/cache'

const create = async (data: Strategy): Promise<Strategy> => {
  const parsedData = StrategyNoGoalSchema.parse(data)

  const response = await fetch('/api/strategy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create strategy')
  }

  const cacheKey = `strategies:${parsedData.planId}`
  const cached = getCachedData<Strategy[]>(cacheKey) || []
  setCachedData(cacheKey, [...cached, parsedData as Strategy])

  return parsedData
}

const createBulk = async (strategies: Strategy[]): Promise<Strategy[]> => {
  const parsedData = StrategyArraySchema.parse(strategies)

  const response = await fetch('/api/strategy/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create strategies')
  }

  const planId = strategies[0]?.planId
  if (planId) {
    const cacheKey = `strategies:${planId}`
    const cached = getCachedData<Strategy[]>(cacheKey) || []
    setCachedData(cacheKey, [...cached, ...parsedData as Strategy[]])
  }

  return parsedData
}

const get = async (id: string): Promise<Strategy | null> => {
  const cacheKey = `strategy:${id}`
  const cached = getCachedData<Strategy>(cacheKey)
  if (cached) return cached

  const response = await fetch(`/api/strategy/${id}`)
  if (!response.ok) {
    console.error(`Failed to fetch strategy ${id} from remote:`, response.status)
    return null
  }

  const remoteStrategy = await response.json()
  if (remoteStrategy) setCachedData(cacheKey, remoteStrategy)
  return remoteStrategy
}

const getByPlanId = async (planId: string, status = Status.ACTIVE): Promise<Strategy[]> => {
  const cacheKey = `strategies:${planId}`
  const cached = getCachedData<Strategy[]>(cacheKey)
  if (cached) return cached

  const response = await fetch(`/api/strategy?planId=${planId}&status=${status}`)
  if (!response.ok) {
    return []
  }

  const remoteStrategies = await response.json()
  setCachedData(cacheKey, remoteStrategies)
  return remoteStrategies
}

const getByGoalId = async (goalId: string, status = Status.ACTIVE): Promise<Strategy[]> => {
  const cacheKey = `strategies:goal:${goalId}`
  const cached = getCachedData<Strategy[]>(cacheKey)
  if (cached) return cached

  const response = await fetch(`/api/strategy?goalId=${goalId}&status=${status}`)
  if (!response.ok) {
    return []
  }

  const remoteStrategies = await response.json()
  setCachedData(cacheKey, remoteStrategies)
  return remoteStrategies
}

const update = async (id: string, strategy: Prisma.StrategyUpdateInput): Promise<Partial<Strategy>> => {
  const parsedData = PartialStrategySchema.parse(strategy)

  const response = await fetch(`/api/strategy/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update strategy')
  }

  const cacheKey = `strategy:${id}`
  const data = { ...(getCachedData<Strategy>(cacheKey) || {}), ...parsedData } as Strategy
  setCachedData(cacheKey, data)
  if (strategy.planId) {
    const listKey = `strategies:${strategy.planId}`
    const list = getCachedData<Strategy[]>(listKey)
    if (list) {
      setCachedData(listKey, list.map(s => s.id === id ? { ...s, ...parsedData } as Strategy : s))
    }
  }

  return parsedData
}

const deleteItem = async (id: string): Promise<void> => {
  const response = await fetch(`/api/strategy/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete strategy')
  }

  const cacheKey = `strategy:${id}`
  const strategy = getCachedData<Strategy>(cacheKey)
  setCachedData(cacheKey, null as any)
  if (strategy?.planId) {
    const listKey = `strategies:${strategy.planId}`
    const list = getCachedData<Strategy[]>(listKey)
    if (list) {
      setCachedData(listKey, list.filter(s => s.id !== id))
    }
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
