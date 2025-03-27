import { goalHandler, goalHistoryHandler, indicatorHandler, indicatorHistoryHandler, strategyHandler, strategyHistoryHandler } from '@/db/dexieHandler'
import { GoalArraySchema, GoalSchema, PartialGoalSchema } from '@/lib/validators/goal'
import { Goal, Prisma } from '@prisma/client'
import { SyncService } from '@/services/sync'
import { QueueEntityType, QueueOperation, Status } from '@/app/types/types'

const create = async (data: Prisma.GoalCreateInput): Promise<Goal> => {
  const parsedData = { ...GoalSchema.parse(data), planId: data.plan.connect!.id! }
  await goalHandler.create(parsedData)
  await SyncService.queueForSync(QueueEntityType.GOAL, parsedData.id, QueueOperation.CREATE, parsedData)
  return parsedData
}

const createBulk = async (goals: Prisma.GoalCreateManyInput[]): Promise<Goal[]> => {
  const parsedData = GoalArraySchema.parse(goals)
  await goalHandler.createMany(parsedData)
  await SyncService.queueForSync(QueueEntityType.GOAL_BULK, 'bulk', QueueOperation.CREATE, goals)
  return parsedData
}

const get = async (id: string): Promise<Goal | null> => {
  try {
    const goal = await goalHandler.findOne(id)
    if (goal) {
      return goal
    }

    const isQueuedForDeletion = await SyncService.isItemQueuedForOperation(
      QueueEntityType.GOAL,
      id,
      QueueOperation.DELETE
    )

    if (isQueuedForDeletion) {
      return null
    }

    if (!SyncService.isEnabled) {
      return null
    }

    const response = await fetch(`/api/goal/${id}`)
    if (!response.ok) {
      console.error(`Failed to fetch goal ${id} from remote:`, response.status)
      return null
    }

    const remoteGoal = await response.json()
    try {
      await goalHandler.create(remoteGoal)
    } catch (error) {
      console.error('Error creating goal:', error)
    }
    return remoteGoal
  } catch (error) {
    console.error(`Error fetching goal ${id}:`, error)
    return null
  }
}

const getByPlanId = async (planId: string, status = Status.ACTIVE): Promise<Goal[]> => {
  const goals = await goalHandler.findMany({ planId, status })

  if (goals?.length > 0) {
    return goals
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const remoteGoals = await fetch(`/api/goal?planId=${planId}&status=${status}`)
    .then(response => response.json())

  const filteredGoals = await SyncService.filterQueuedForDeletion(remoteGoals, QueueEntityType.GOAL)

  if (filteredGoals.length > 0) {
    try {
      await goalHandler.createMany(filteredGoals)
    } catch (error) {
      console.error('Error creating goals:', error)
    }
  }

  return filteredGoals
}


const update = async (id: string, goal: Prisma.GoalUpdateInput): Promise<Partial<Goal>> => {
  const parsedData = PartialGoalSchema.parse(goal)
  await goalHandler.update(id, parsedData as Goal)
  await SyncService.queueForSync(QueueEntityType.GOAL, id, QueueOperation.UPDATE, { ...parsedData, id })
  return { ...parsedData, id }
}

const deleteItem = async (id: string): Promise<void> => {
  // First get all related items
  const strategies = await strategyHandler.findMany({ goalId: id })
  const indicators = await indicatorHandler.findMany({ goalId: id })

  // Delete all related histories locally only
  for (const strategy of strategies) {
    await strategyHistoryHandler.deleteMany({ strategyId: strategy.id })
  }

  for (const indicator of indicators) {
    await indicatorHistoryHandler.deleteMany({ indicatorId: indicator.id })
  }

  // Delete strategies and indicators locally and queue for sync
  for (const strategy of strategies) {
    await strategyHandler.delete(strategy.id)
    await SyncService.queueForSync(QueueEntityType.STRATEGY, strategy.id, QueueOperation.DELETE, strategy.id)
  }

  for (const indicator of indicators) {
    await indicatorHandler.delete(indicator.id)
    await SyncService.queueForSync(QueueEntityType.INDICATOR, indicator.id, QueueOperation.DELETE, indicator.id)
  }

  // Delete goal history locally only
  await goalHistoryHandler.deleteMany({ goalId: id })

  // Delete the goal and queue for sync
  await goalHandler.delete(id)
  await SyncService.queueForSync(QueueEntityType.GOAL, id, QueueOperation.DELETE, id)
}

export const GoalService = {
  create,
  createBulk,
  get,
  getByPlanId,
  update,
  deleteItem,
}
