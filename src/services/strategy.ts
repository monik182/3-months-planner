import { strategyHandler } from '@/db/dexieHandler'
import { StrategyArraySchema, PartialStrategySchema, StrategyNoGoalSchema } from '@/lib/validators/strategy'
import { Strategy, Prisma } from '@prisma/client'
import { SyncService } from '@/services/sync'
import { QueueEntityType, QueueOperation, Status } from '@/app/types/types'

const create = async (data: Strategy): Promise<Strategy> => {
  const parsedData = StrategyNoGoalSchema.parse(data)
  await strategyHandler.create(parsedData)
  await SyncService.queueForSync(QueueEntityType.STRATEGY, parsedData.id, QueueOperation.CREATE, parsedData)
  return parsedData
}

const createBulk = async (strategies: Strategy[]): Promise<Strategy[]> => {
  const parsedData = StrategyArraySchema.parse(strategies)
  await strategyHandler.createMany(parsedData)
  for (const strategy of parsedData) {
    await SyncService.queueForSync(QueueEntityType.STRATEGY_BULK, strategy.id, QueueOperation.CREATE, strategy)
  }
  return parsedData
}

const get = async (id: string): Promise<Strategy | null> => {
  try {
    const strategy = await strategyHandler.findOne(id)
    if (strategy) {
      return strategy
    }

    const isQueuedForDeletion = await SyncService.isItemQueuedForOperation(
      QueueEntityType.STRATEGY,
      id,
      QueueOperation.DELETE
    )

    if (isQueuedForDeletion) {
      return null
    }

    if (!SyncService.isEnabled) {
      return null
    }

    const response = await fetch(`/api/strategy/${id}`)
    if (!response.ok) {
      console.error(`Failed to fetch strategy ${id} from remote:`, response.status)
      return null
    }

    return response.json()
  } catch (error) {
    console.error(`Error fetching strategy ${id}:`, error)
    return null
  }
}

const getByPlanId = async (planId: string, status = Status.ACTIVE): Promise<Strategy[]> => {
  const strategies = await strategyHandler.findMany({ planId, status })

  if (strategies?.length > 0) {
    return strategies
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const remoteStrategies = await fetch(`/api/strategy?planId=${planId}&status=${status}`)
    .then(response => response.json())

  const filteredStrategies = await SyncService.filterQueuedForDeletion(remoteStrategies, QueueEntityType.STRATEGY)
  return filteredStrategies
}

const getByGoalId = async (goalId: string, status = Status.ACTIVE): Promise<Strategy[]> => {
  const strategies = await strategyHandler.findMany({ goalId, status })

  if (strategies?.length > 0) {
    return strategies
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const remoteStrategies = await fetch(`/api/strategy?goalId=${goalId}&status=${status}`)
    .then(response => response.json())

  const filteredStrategies = await SyncService.filterQueuedForDeletion(remoteStrategies, QueueEntityType.STRATEGY)
  return filteredStrategies
}

const update = async (id: string, strategy: Prisma.StrategyUpdateInput): Promise<Partial<Strategy>> => {
  const parsedData = PartialStrategySchema.parse(strategy)
  await strategyHandler.update(id, parsedData as Strategy)
  await SyncService.queueForSync(QueueEntityType.STRATEGY, id, QueueOperation.UPDATE, { ...parsedData, id })
  return { ...parsedData, id }
}

const deleteItem = async (id: string): Promise<void> => {
  await strategyHandler.delete(id)
  await SyncService.queueForSync(QueueEntityType.STRATEGY, id, QueueOperation.DELETE, id)
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