import { indicatorHistoryHandler } from '@/db/dexieHandler'
import { IndicatorHistoryExtended, Status } from '@/app/types/types'
import { IndicatorHistory, Prisma } from '@prisma/client'
import { IndicatorHistorySchema, PartialIndicatorHistorySchema, IndicatorHistoryNoIndicatorArraySchema } from '@/lib/validators/indicatorHistory'
import { SyncService } from '@/services/sync'

const create = async (data: Prisma.IndicatorHistoryCreateInput): Promise<IndicatorHistory> => {
  const parsedData = IndicatorHistorySchema.parse(data)

  if (!SyncService.isEnabled) {
    await indicatorHistoryHandler.create(parsedData)
    return parsedData
  }

  const response = await fetch('/api/indicator/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create indicator history')
  }

  await indicatorHistoryHandler.create(parsedData)
  return parsedData
}

const createBulk = async (histories: Prisma.IndicatorHistoryCreateManyInput[]): Promise<IndicatorHistory[]> => {
  const parsedData = IndicatorHistoryNoIndicatorArraySchema.parse(histories)

  if (!SyncService.isEnabled) {
    await indicatorHistoryHandler.createMany(parsedData)
    return parsedData
  }

  const response = await fetch('/api/indicator/history/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create indicator histories')
  }

  await indicatorHistoryHandler.createMany(parsedData)
  return parsedData
}

const get = async (id: string): Promise<IndicatorHistory | null> => {
  const history = await indicatorHistoryHandler.findOne(id)
  if (history) {
    return history
  }

  if (!SyncService.isEnabled) {
    return null
  }

  const response = await fetch(`/api/indicator/history/${id}`)
  if (!response.ok) {
    console.error(`Failed to fetch indicator history ${id} from remote:`, response.status)
    return null
  }

  const remoteHistory = await response.json()
  try {
    await indicatorHistoryHandler.create(remoteHistory)
  } catch (error) {
    console.error('Error creating indicator history:', error)
  }
  return remoteHistory
}

const getByPlanId = async (planId: string, sequence?: number, status = Status.ACTIVE): Promise<IndicatorHistoryExtended[]> => {
  const histories = await indicatorHistoryHandler.findMany({ planId, status }, { sequence })
  if (histories?.length > 0) {
    return histories as IndicatorHistoryExtended[]
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const url = new URL('/api/indicator/history', window.location.origin)
  url.searchParams.append('planId', planId)
  if (sequence !== undefined) url.searchParams.append('sequence', sequence.toString())
  url.searchParams.append('status', status)

  const response = await fetch(url.toString())
  if (!response.ok) {
    return []
  }

  const remoteHistories = await response.json()
  try {
    await indicatorHistoryHandler.createMany(remoteHistories)
  } catch (error) {
    console.error('Error creating indicator histories:', error)
  }
  return remoteHistories
}

const getByGoalId = async (goalId: string, sequence?: number, status = Status.ACTIVE): Promise<IndicatorHistoryExtended[]> => {
  const histories = await indicatorHistoryHandler.findManyByGoalId({ goalId, status }, { sequence })
  if (histories?.length > 0) {
    return histories as IndicatorHistoryExtended[]
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const url = new URL('/api/indicator/history', window.location.origin)
  url.searchParams.append('goalId', goalId)
  if (sequence !== undefined) url.searchParams.append('sequence', sequence.toString())
  url.searchParams.append('status', status)

  const response = await fetch(url.toString())
  if (!response.ok) {
    return []
  }

  const remoteHistories = await response.json()
  try {
    await indicatorHistoryHandler.createMany(remoteHistories)
  } catch (error) {
    console.error('Error creating indicator histories:', error)
  }
  return remoteHistories
}

const update = async (id: string, history: Prisma.IndicatorHistoryUpdateInput): Promise<Partial<IndicatorHistory>> => {
  const parsedData = PartialIndicatorHistorySchema.parse(history)

  if (!SyncService.isEnabled) {
    await indicatorHistoryHandler.update(id, parsedData as IndicatorHistory)
    return { ...parsedData, id }
  }

  const response = await fetch(`/api/indicator/history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update indicator history')
  }

  await indicatorHistoryHandler.update(id, parsedData)
  return parsedData
}

const deleteItem = async (id: string): Promise<void> => {
  if (!SyncService.isEnabled) {
    await indicatorHistoryHandler.delete(id)
    return
  }

  const response = await fetch(`/api/indicator/history/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete indicator history')
  }

  await indicatorHistoryHandler.delete(id)
}

export const IndicatorHistoryService = {
  create,
  createBulk,
  get,
  getByPlanId,
  getByGoalId,
  update,
  deleteItem,
}
