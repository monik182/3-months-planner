import { strategyHistoryHandler } from '@/db/dexieHandler'
import { StrategyHistoryExtended, Status } from '@/app/types/types'
import { Prisma, StrategyHistory } from '@prisma/client'
import { StrategyHistorySchema, PartialStrategyHistorySchema, StrategyHistoryNoStrategyArraySchema } from '@/lib/validators/strategyHistory'
import { SyncService } from '@/services/sync'

const create = async (data: Prisma.StrategyHistoryCreateInput): Promise<StrategyHistory> => {
  const parsedData = StrategyHistorySchema.parse(data)

  if (!SyncService.isEnabled) {
    await strategyHistoryHandler.create(parsedData)
    return parsedData
  }

  const response = await fetch('/api/strategy/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create strategy history')
  }

  await strategyHistoryHandler.create(parsedData)
  return parsedData
}

const createBulk = async (histories: Prisma.StrategyHistoryCreateManyInput[]): Promise<StrategyHistory[]> => {
  const parsedData = StrategyHistoryNoStrategyArraySchema.parse(histories)

  if (!SyncService.isEnabled) {
    await strategyHistoryHandler.createMany(parsedData)
    return parsedData
  }

  const response = await fetch('/api/strategy/history/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create strategy histories')
  }

  await strategyHistoryHandler.createMany(parsedData)
  return parsedData
}

const get = async (id: string): Promise<StrategyHistory | null> => {
  const history = await strategyHistoryHandler.findOne(id)
  if (history) {
    return history
  }

  if (!SyncService.isEnabled) {
    return null
  }

  const response = await fetch(`/api/strategy/history/${id}`)
  if (!response.ok) {
    console.error(`Failed to fetch strategy history ${id} from remote:`, response.status)
    return null
  }

  const remoteHistory = await response.json()
  try {
    await strategyHistoryHandler.create(remoteHistory)
  } catch (error) {
    console.error('Error creating strategy history:', error)
  }
  return remoteHistory
}

const getByPlanId = async (planId: string, sequence?: string, status = Status.ACTIVE): Promise<StrategyHistoryExtended[]> => {
  const histories = await strategyHistoryHandler.findMany({ planId, status }, {}, sequence)
  if (histories?.length > 0) {
    return histories as StrategyHistoryExtended[]
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const url = new URL('/api/strategy/history', window.location.origin)
  url.searchParams.append('planId', planId)
  if (sequence !== undefined) url.searchParams.append('sequence', sequence)
  url.searchParams.append('status', status)

  const response = await fetch(url.toString())
  if (!response.ok) {
    return []
  }

  const remoteHistories = await response.json()
  try {
    await strategyHistoryHandler.createMany(remoteHistories)
  } catch (error) {
    console.error('Error creating strategy histories:', error)
  }
  return remoteHistories
}

const getByGoalId = async (goalId: string, sequence?: number, status = Status.ACTIVE): Promise<StrategyHistoryExtended[]> => {
  const histories = await strategyHistoryHandler.findManyByGoalId({ goalId, status }, { sequence })
  if (histories?.length > 0) {
    return histories as StrategyHistoryExtended[]
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const url = new URL('/api/strategy/history', window.location.origin)
  url.searchParams.append('goalId', goalId)
  if (sequence !== undefined) url.searchParams.append('sequence', sequence.toString())
  url.searchParams.append('status', status)

  const response = await fetch(url.toString())
  if (!response.ok) {
    return []
  }

  const remoteHistories = await response.json()
  try {
    await strategyHistoryHandler.createMany(remoteHistories)
  } catch (error) {
    console.error('Error creating strategy histories:', error)
  }
  return remoteHistories
}

const update = async (id: string, history: Prisma.StrategyHistoryUpdateInput): Promise<Partial<StrategyHistory>> => {
  const parsedData = PartialStrategyHistorySchema.parse(history)

  if (!SyncService.isEnabled) {
    await strategyHistoryHandler.update(id, parsedData as StrategyHistory)
    return { ...parsedData, id }
  }

  const response = await fetch(`/api/strategy/history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update strategy history')
  }

  await strategyHistoryHandler.update(id, parsedData)
  return parsedData
}

const deleteItem = async (id: string): Promise<void> => {
  if (!SyncService.isEnabled) {
    await strategyHistoryHandler.delete(id)
    return
  }

  const response = await fetch(`/api/strategy/history/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete strategy history')
  }

  await strategyHistoryHandler.delete(id)
}

export const StrategyHistoryService = {
  create,
  createBulk,
  get,
  getByPlanId,
  getByGoalId,
  update,
  deleteItem,
}
