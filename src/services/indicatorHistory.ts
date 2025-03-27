import { indicatorHistoryHandler } from '@/db/dexieHandler'
import { IndicatorHistoryExtended, QueueEntityType, QueueOperation, Status } from '@/app/types/types'
import { IndicatorHistory, Prisma } from '@prisma/client'
import { IndicatorHistorySchema, PartialIndicatorHistorySchema, IndicatorHistoryNoIndicatorArraySchema } from '@/lib/validators/indicatorHistory'
import { SyncService } from '@/services/sync'

const create = async (data: Prisma.IndicatorHistoryCreateInput): Promise<IndicatorHistory> => {
  const parsedData = IndicatorHistorySchema.parse(data)
  await indicatorHistoryHandler.create(parsedData)
  await SyncService.queueForSync(QueueEntityType.INDICATOR_HISTORY, parsedData.id, QueueOperation.CREATE, parsedData)
  return parsedData
}

const createBulk = async (histories: Prisma.IndicatorHistoryCreateManyInput[]): Promise<IndicatorHistory[]> => {
  const parsedData = IndicatorHistoryNoIndicatorArraySchema.parse(histories)
  await indicatorHistoryHandler.createMany(parsedData)
  await SyncService.queueForSync(QueueEntityType.INDICATOR_HISTORY_BULK, 'bulk', QueueOperation.CREATE, histories)
  return parsedData
}

const get = async (id: string): Promise<IndicatorHistory | null> => {
  try {
    const history = await indicatorHistoryHandler.findOne(id)
    if (history) {
      return history
    }

    const isQueuedForDeletion = await SyncService.isItemQueuedForOperation(
      QueueEntityType.INDICATOR_HISTORY,
      id,
      QueueOperation.DELETE
    )

    if (isQueuedForDeletion) {
      return null
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
  } catch (error) {
    console.error(`Error fetching indicator history ${id}:`, error)
    return null
  }
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

  const remoteHistories = await fetch(url.toString())
    .then(response => response.json())

  const filteredHistories = await SyncService.filterQueuedForDeletion(remoteHistories, QueueEntityType.INDICATOR_HISTORY)
  if (filteredHistories.length > 0) {
    try {
      await indicatorHistoryHandler.createMany(filteredHistories)
    } catch (error) {
      console.error('Error creating indicator histories:', error)
    }
  }
  return filteredHistories
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

  const remoteHistories = await fetch(url.toString())
    .then(response => response.json())

  const filteredHistories = await SyncService.filterQueuedForDeletion(remoteHistories, QueueEntityType.INDICATOR_HISTORY)
  if (filteredHistories.length > 0) {
    try {
      await indicatorHistoryHandler.createMany(filteredHistories)
    } catch (error) {
      console.error('Error creating indicator histories:', error)
    }
  }
  return filteredHistories
}

const update = async (id: string, history: Prisma.IndicatorHistoryUpdateInput): Promise<Partial<IndicatorHistory>> => {
  const parsedData = PartialIndicatorHistorySchema.parse(history)
  await indicatorHistoryHandler.update(id, parsedData as IndicatorHistory)
  await SyncService.queueForSync(QueueEntityType.INDICATOR_HISTORY, id, QueueOperation.UPDATE, { ...parsedData, id })
  return { ...parsedData, id }
}

const deleteItem = async (id: string): Promise<void> => {
  await indicatorHistoryHandler.delete(id)
  await SyncService.queueForSync(QueueEntityType.INDICATOR_HISTORY, id, QueueOperation.DELETE, id)
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
