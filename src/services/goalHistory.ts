import { goalHistoryHandler } from '@/db/dexieHandler'
import { GoalHistoryExtended, Status } from '@/app/types/types'
import { Prisma, GoalHistory } from '@prisma/client'
import { GoalHistorySchema, PartialGoalHistorySchema, GoalHistoryNoGoalArraySchema } from '@/lib/validators/goalHistory'
import { SyncService } from '@/services/sync'

const create = async (data: Prisma.GoalHistoryCreateInput): Promise<GoalHistory> => {
  const parsedData = GoalHistorySchema.parse(data)

  if (!SyncService.isEnabled) {
    await goalHistoryHandler.create(parsedData)
    return parsedData
  }

  const response = await fetch('/api/goal/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create goal history')
  }

  await goalHistoryHandler.create(parsedData)
  return parsedData
}

const createBulk = async (histories: Prisma.GoalHistoryCreateManyInput[]): Promise<GoalHistory[]> => {
  const parsedData = GoalHistoryNoGoalArraySchema.parse(histories)

  if (!SyncService.isEnabled) {
    await goalHistoryHandler.createMany(parsedData)
    return parsedData
  }

  const response = await fetch('/api/goal/history/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create goal histories')
  }

  await goalHistoryHandler.createMany(parsedData)
  return parsedData
}

const get = async (id: string): Promise<GoalHistory | null> => {
  const history = await goalHistoryHandler.findOne(id)
  if (history) {
    return history
  }

  if (!SyncService.isEnabled) {
    return null
  }

  const response = await fetch(`/api/goal/history/${id}`)
  if (!response.ok) {
    console.error(`Failed to fetch goal history ${id} from remote:`, response.status)
    return null
  }

  const remoteHistory = await response.json()
  await goalHistoryHandler.create(remoteHistory)
  return remoteHistory
}

const getByPlanId = async (planId: string, sequence?: number, status = Status.ACTIVE): Promise<GoalHistoryExtended[]> => {
  const histories = await goalHistoryHandler.findMany({ planId, status }, { sequence })
  if (histories?.length > 0) {
    return histories as GoalHistoryExtended[]
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const url = new URL('/api/goal/history', window.location.origin)
  url.searchParams.append('planId', planId)
  if (sequence !== undefined) url.searchParams.append('sequence', sequence.toString())
  url.searchParams.append('status', status)

  const response = await fetch(url.toString())
  if (!response.ok) {
    return []
  }

  const remoteHistories = await response.json()
  if (remoteHistories.length > 0) {
    try {
      await goalHistoryHandler.createMany(remoteHistories)
    } catch (error) {
      console.error('Error creating goal histories:', error)
    }
  }
  return remoteHistories
}

const update = async (id: string, history: Prisma.GoalHistoryUpdateInput): Promise<Partial<GoalHistory>> => {
  const parsedData = PartialGoalHistorySchema.parse(history)

  if (!SyncService.isEnabled) {
    await goalHistoryHandler.update(id, parsedData as GoalHistory)
    return { ...parsedData, id }
  }

  const response = await fetch(`/api/goal/history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update goal history')
  }

  await goalHistoryHandler.update(id, parsedData)
  return parsedData
}

const deleteItem = async (id: string): Promise<void> => {
  if (!SyncService.isEnabled) {
    await goalHistoryHandler.delete(id)
    return
  }

  const response = await fetch(`/api/goal/history/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete goal history')
  }

  await goalHistoryHandler.delete(id)
}

export const GoalHistoryService = {
  create,
  createBulk,
  get,
  getByPlanId,
  update,
  deleteItem,
}
