import { strategyHistoryHandler } from '@/db/dexieHandler'
import { StrategyHistoryExtended, QueueEntityType, QueueOperation, Status } from '@/app/types/types'
import { Prisma, StrategyHistory } from '@prisma/client'
import { StrategyHistorySchema, PartialStrategyHistorySchema, StrategyHistoryNoStrategyArraySchema } from '@/lib/validators/strategyHistory'
import { SyncService } from '@/services/sync'

const create = async (data: Prisma.StrategyHistoryCreateInput): Promise<StrategyHistory> => {
  const parsedData = StrategyHistorySchema.parse(data)
  await strategyHistoryHandler.create(parsedData)
  await SyncService.queueForSync(QueueEntityType.STRATEGY_HISTORY, parsedData.id, QueueOperation.CREATE, parsedData)
  return parsedData
}

const createBulk = async (histories: Prisma.StrategyHistoryCreateManyInput[]): Promise<StrategyHistory[]> => {
  const parsedData = StrategyHistoryNoStrategyArraySchema.parse(histories)
  await strategyHistoryHandler.createMany(parsedData)
  await SyncService.queueForSync(QueueEntityType.STRATEGY_HISTORY_BULK, 'bulk', QueueOperation.CREATE, histories)
  return parsedData
}

const get = async (id: string): Promise<StrategyHistory | null> => {
  try {
    const history = await strategyHistoryHandler.findOne(id)
    if (history) {
      return history
    }

    const isQueuedForDeletion = await SyncService.isItemQueuedForOperation(
      QueueEntityType.STRATEGY_HISTORY,
      id,
      QueueOperation.DELETE
    )

    if (isQueuedForDeletion) {
      return null
    }

    if (!SyncService.isEnabled) {
      return null
    }

    const response = await fetch(`/api/strategy/history/${id}`)
    if (!response.ok) {
      console.error(`Failed to fetch strategy history ${id} from remote:`, response.status)
      return null
    }

    return response.json()
  } catch (error) {
    console.error(`Error fetching strategy history ${id}:`, error)
    return null
  }
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

  const remoteHistories = await fetch(url.toString())
    .then(response => response.json())

  const filteredHistories = await SyncService.filterQueuedForDeletion(remoteHistories, QueueEntityType.STRATEGY_HISTORY)
  return filteredHistories
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

  const remoteHistories = await fetch(url.toString())
    .then(response => response.json())

  const filteredHistories = await SyncService.filterQueuedForDeletion(remoteHistories, QueueEntityType.STRATEGY_HISTORY)
  return filteredHistories
}

const update = async (id: string, history: Prisma.StrategyHistoryUpdateInput): Promise<Partial<StrategyHistory>> => {
  const parsedData = PartialStrategyHistorySchema.parse(history)
  await strategyHistoryHandler.update(id, parsedData as StrategyHistory)
  await SyncService.queueForSync(QueueEntityType.STRATEGY_HISTORY, id, QueueOperation.UPDATE, { ...parsedData, id })
  return { ...parsedData, id }
}

const deleteItem = async (id: string): Promise<void> => {
  await strategyHistoryHandler.delete(id)
  await SyncService.queueForSync(QueueEntityType.STRATEGY_HISTORY, id, QueueOperation.DELETE, id)
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
