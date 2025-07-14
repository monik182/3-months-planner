import { PartialIndicatorSchema, IndicatorNoGoalSchema, IndicatorNoGoalArraySchema } from '@/lib/validators/indicator'
import { Indicator, Prisma } from '@prisma/client'
import { Status } from '@/app/types/types'
import { getCachedData, setCachedData } from '@/lib/cache'

const create = async (data: Indicator): Promise<Indicator> => {
  const parsedData = IndicatorNoGoalSchema.parse(data)

  const response = await fetch('/api/indicator', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create indicator')
  }

  const cacheKey = `indicators:${parsedData.planId}`
  const cached = getCachedData<Indicator[]>(cacheKey) || []
  setCachedData(cacheKey, [...cached, parsedData as Indicator])

  return parsedData
}

const createBulk = async (indicators: Prisma.IndicatorCreateManyInput[]): Promise<Indicator[]> => {
  const parsedData = IndicatorNoGoalArraySchema.parse(indicators)

  const response = await fetch('/api/indicator/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create indicators in bulk')
  }

  const planId = indicators[0]?.planId
  if (planId) {
    const cacheKey = `indicators:${planId}`
    const cached = getCachedData<Indicator[]>(cacheKey) || []
    setCachedData(cacheKey, [...cached, ...parsedData as Indicator[]])
  }

  return parsedData
}

const get = async (id: string): Promise<Indicator | null> => {
  try {
    const cacheKey = `indicator:${id}`
    const cached = getCachedData<Indicator>(cacheKey)
    if (cached) return cached

    const response = await fetch(`/api/indicator/${id}`)
    if (!response.ok) {
      console.error(`Failed to fetch indicator ${id} from remote:`, response.status)
      return null
    }

    const remoteIndicator = await response.json()
    if (remoteIndicator) setCachedData(cacheKey, remoteIndicator)
    return remoteIndicator
  } catch (error) {
    console.error(`Error fetching indicator ${id}:`, error)
    return null
  }
}

const getByPlanId = async (planId: string, status = Status.ACTIVE): Promise<Indicator[]> => {
  const cacheKey = `indicators:${planId}`
  const cached = getCachedData<Indicator[]>(cacheKey)
  if (cached) return cached

  const response = await fetch(`/api/indicator?planId=${planId}&status=${status}`)
  if (!response.ok) {
    return []
  }

  const remoteIndicators = await response.json()
  setCachedData(cacheKey, remoteIndicators)
  return remoteIndicators
}

const getByGoalId = async (goalId: string, status = Status.ACTIVE): Promise<Indicator[]> => {
  const cacheKey = `indicators:goal:${goalId}`
  const cached = getCachedData<Indicator[]>(cacheKey)
  if (cached) return cached

  const response = await fetch(`/api/indicator?goalId=${goalId}&status=${status}`)
  if (!response.ok) {
    return []
  }

  const remoteIndicators = await response.json()
  setCachedData(cacheKey, remoteIndicators)
  return remoteIndicators
}

const update = async (id: string, indicator: Prisma.IndicatorUpdateInput): Promise<Partial<Indicator>> => {
  const parsedData = PartialIndicatorSchema.parse(indicator)

  const response = await fetch(`/api/indicator/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update indicator')
  }

  const cacheKey = `indicator:${id}`
  const data = { ...(getCachedData<Indicator>(cacheKey) || {}), ...parsedData } as Indicator
  setCachedData(cacheKey, data)
  if (indicator.planId) {
    const listKey = `indicators:${indicator.planId}`
    const list = getCachedData<Indicator[]>(listKey)
    if (list) {
      setCachedData(listKey, list.map(i => i.id === id ? { ...i, ...parsedData } as Indicator : i))
    }
  }

  return parsedData
}

const deleteItem = async (id: string): Promise<void> => {

  const response = await fetch(`/api/indicator/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete indicator')
  }

  const cacheKey = `indicator:${id}`
  const indicator = getCachedData<Indicator>(cacheKey)
  setCachedData(cacheKey, null as any)
  if (indicator?.planId) {
    const listKey = `indicators:${indicator.planId}`
    const list = getCachedData<Indicator[]>(listKey)
    if (list) {
      setCachedData(listKey, list.filter(i => i.id !== id))
    }
  }
}

export const IndicatorService = {
  create,
  createBulk,
  get,
  getByPlanId,
  getByGoalId,
  update,
  deleteItem,
}
