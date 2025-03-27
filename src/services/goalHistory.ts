import { goalHistoryHandler } from '@/db/dexieHandler'
import { GoalHistoryExtended, QueueEntityType, QueueOperation, Status } from '@/app/types/types'
import { Prisma, GoalHistory } from '@prisma/client'
import { GoalHistorySchema, PartialGoalHistorySchema, GoalHistoryNoGoalArraySchema } from '@/lib/validators/goalHistory'
import { SyncService } from '@/services/sync'

const create = async (data: Prisma.GoalHistoryCreateInput): Promise<GoalHistory> => {
  const parsedData = GoalHistorySchema.parse(data)
  await goalHistoryHandler.create(parsedData)
  await SyncService.queueForSync(QueueEntityType.GOAL_HISTORY, parsedData.id, QueueOperation.CREATE, parsedData)
  return parsedData
}

const createBulk = async (histories: Prisma.GoalHistoryCreateManyInput[]): Promise<GoalHistory[]> => {
  const parsedData = GoalHistoryNoGoalArraySchema.parse(histories)
  await goalHistoryHandler.createMany(parsedData)
  await SyncService.queueForSync(QueueEntityType.GOAL_HISTORY_BULK, 'bulk', QueueOperation.CREATE, histories)
  return parsedData
}

const get = async (id: string): Promise<GoalHistory | null> => {
  try {
    const history = await goalHistoryHandler.findOne(id)
    if (history) {
      return history
    }

    const isQueuedForDeletion = await SyncService.isItemQueuedForOperation(
      QueueEntityType.GOAL_HISTORY,
      id,
      QueueOperation.DELETE
    )

    if (isQueuedForDeletion) {
      return null
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
  } catch (error) {
    console.error(`Error fetching goal history ${id}:`, error)
    return null
  }
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

  const remoteHistories = await fetch(url.toString())
    .then(response => response.json())

  const filteredHistories = await SyncService.filterQueuedForDeletion(remoteHistories, QueueEntityType.GOAL_HISTORY)
  if (filteredHistories.length > 0) {
    try {
      await goalHistoryHandler.createMany(filteredHistories)
    } catch (error) {
      console.error('Error creating goal histories:', error)
    }
  }
  return filteredHistories
}

const update = async (id: string, history: Prisma.GoalHistoryUpdateInput): Promise<Partial<GoalHistory>> => {
  const parsedData = PartialGoalHistorySchema.parse(history)
  await goalHistoryHandler.update(id, parsedData as GoalHistory)
  await SyncService.queueForSync(QueueEntityType.GOAL_HISTORY, id, QueueOperation.UPDATE, { ...parsedData, id })
  return { ...parsedData, id }
}

const deleteItem = async (id: string): Promise<void> => {
  await goalHistoryHandler.delete(id)
  await SyncService.queueForSync(QueueEntityType.GOAL_HISTORY, id, QueueOperation.DELETE, id)
}

export const GoalHistoryService = {
  create,
  createBulk,
  get,
  getByPlanId,
  update,
  deleteItem,
}
