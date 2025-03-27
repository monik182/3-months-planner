import { indicatorHandler, indicatorHistoryHandler } from '@/db/dexieHandler'
import { PartialIndicatorSchema, IndicatorNoGoalSchema, IndicatorNoGoalArraySchema } from '@/lib/validators/indicator'
import { Indicator, Prisma } from '@prisma/client'
import { SyncService } from '@/services/sync'
import { QueueEntityType, QueueOperation, Status } from '@/app/types/types'

const create = async (data: Indicator): Promise<Indicator> => {
  const parsedData = IndicatorNoGoalSchema.parse(data)
  await indicatorHandler.create(parsedData)
  await SyncService.queueForSync(QueueEntityType.INDICATOR, parsedData.id, QueueOperation.CREATE, parsedData)
  return parsedData
}

const createBulk = async (indicators: Prisma.IndicatorCreateManyInput[]): Promise<Indicator[]> => {
  const parsedData = IndicatorNoGoalArraySchema.parse(indicators)
  await indicatorHandler.createMany(parsedData)
  await SyncService.queueForSync(QueueEntityType.INDICATOR_BULK, 'bulk', QueueOperation.CREATE, indicators)
  return parsedData
}

const get = async (id: string): Promise<Indicator | null> => {
  try {
    const indicator = await indicatorHandler.findOne(id)
    if (indicator) {
      return indicator
    }

    const isQueuedForDeletion = await SyncService.isItemQueuedForOperation(
      QueueEntityType.INDICATOR,
      id,
      QueueOperation.DELETE
    )

    if (isQueuedForDeletion) {
      return null
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

  const remoteIndicators = await fetch(`/api/indicator?planId=${planId}&status=${status}`)
    .then(response => response.json())

  const filteredIndicators = await SyncService.filterQueuedForDeletion(remoteIndicators, QueueEntityType.INDICATOR)
  if (filteredIndicators.length > 0) {
    try {
      await indicatorHandler.createMany(filteredIndicators)
    } catch (error) {
      console.error('Error creating indicators:', error)
    }
  }
  return filteredIndicators
}

const getByGoalId = async (goalId: string, status = Status.ACTIVE): Promise<Indicator[]> => {
  const indicators = await indicatorHandler.findMany({ goalId, status })

  if (indicators?.length > 0) {
    return indicators
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const remoteIndicators = await fetch(`/api/indicator?goalId=${goalId}&status=${status}`)
    .then(response => response.json())

  const filteredIndicators = await SyncService.filterQueuedForDeletion(remoteIndicators, QueueEntityType.INDICATOR)
  return filteredIndicators
}

const update = async (id: string, indicator: Prisma.IndicatorUpdateInput): Promise<Partial<Indicator>> => {
  const parsedData = PartialIndicatorSchema.parse(indicator)
  await indicatorHandler.update(id, parsedData as Indicator)
  await SyncService.queueForSync(QueueEntityType.INDICATOR, id, QueueOperation.UPDATE, { ...parsedData, id })
  return { ...parsedData, id }
}

const deleteItem = async (id: string): Promise<void> => {
  // First delete all related histories locally only
  await indicatorHistoryHandler.deleteMany({ indicatorId: id })

  // Delete the indicator locally and queue for sync
  await indicatorHandler.delete(id)
  await SyncService.queueForSync(QueueEntityType.INDICATOR, id, QueueOperation.DELETE, id)
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
