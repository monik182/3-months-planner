import { indicatorHandler, indicatorHistoryHandler } from '@/db/dexieHandler'
import { PartialIndicatorSchema, IndicatorNoGoalSchema, IndicatorNoGoalArraySchema } from '@/lib/validators/indicator'
import { Indicator, Prisma } from '@prisma/client'
import { SyncService } from '@/services/sync'
import { Status } from '@/app/types/types'

const create = async (data: Indicator): Promise<Indicator> => {
  const parsedData = IndicatorNoGoalSchema.parse(data)

  if (!SyncService.isEnabled) {
    await indicatorHandler.create(parsedData)
    return parsedData
  }

  const response = await fetch('/api/indicator', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create indicator')
  }

  await indicatorHandler.create(parsedData)
  return parsedData
}

const createBulk = async (indicators: Prisma.IndicatorCreateManyInput[]): Promise<Indicator[]> => {
  const parsedData = IndicatorNoGoalArraySchema.parse(indicators)

  if (!SyncService.isEnabled) {
    await indicatorHandler.createMany(parsedData)
    return parsedData
  }

  const response = await fetch('/api/indicator/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create indicators in bulk')
  }

  await indicatorHandler.createMany(parsedData)
  return parsedData
}

const get = async (id: string): Promise<Indicator | null> => {
  try {
    const indicator = await indicatorHandler.findOne(id)
    if (indicator) {
      return indicator
    }

    if (!SyncService.isEnabled) {
      return null
    }

    const response = await fetch(`/api/indicator/${id}`)
    if (!response.ok) {
      console.error(`Failed to fetch indicator ${id} from remote:`, response.status)
      return null
    }

    const remoteIndicator = await response.json()
    try {
      await indicatorHandler.create(remoteIndicator)
    } catch (error) {
      console.error('Error creating indicator:', error)
    }
    return remoteIndicator
  } catch (error) {
    console.error(`Error fetching indicator ${id}:`, error)
    return null
  }
}

const getByPlanId = async (planId: string, status = Status.ACTIVE): Promise<Indicator[]> => {
  const indicators = await indicatorHandler.findMany({ planId, status })
  if (indicators?.length > 0) {
    return indicators
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const response = await fetch(`/api/indicator?planId=${planId}&status=${status}`)
  if (!response.ok) {
    return []
  }

  const remoteIndicators = await response.json()
  try {
    await indicatorHandler.createMany(remoteIndicators)
  } catch (error) {
    console.error('Error creating indicators:', error)
  }
  return remoteIndicators
}

const getByGoalId = async (goalId: string, status = Status.ACTIVE): Promise<Indicator[]> => {
  const indicators = await indicatorHandler.findMany({ goalId, status })
  if (indicators?.length > 0) {
    return indicators
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const response = await fetch(`/api/indicator?goalId=${goalId}&status=${status}`)
  if (!response.ok) {
    return []
  }

  const remoteIndicators = await response.json()
  try {
    await indicatorHandler.createMany(remoteIndicators)
  } catch (error) {
    console.error('Error creating indicators:', error)
  }
  return remoteIndicators
}

const update = async (id: string, indicator: Prisma.IndicatorUpdateInput): Promise<Partial<Indicator>> => {
  const parsedData = PartialIndicatorSchema.parse(indicator)

  if (!SyncService.isEnabled) {
    await indicatorHandler.update(id, parsedData as Indicator)
    return { ...parsedData, id }
  }

  const response = await fetch(`/api/indicator/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update indicator')
  }

  await indicatorHandler.update(id, parsedData)
  return parsedData
}

const deleteItem = async (id: string): Promise<void> => {
  await indicatorHistoryHandler.deleteMany({ indicatorId: id })

  if (!SyncService.isEnabled) {
    await indicatorHandler.delete(id)
    return
  }

  const response = await fetch(`/api/indicator/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete indicator')
  }

  await indicatorHandler.delete(id)
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
