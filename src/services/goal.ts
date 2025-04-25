import { goalHandler, goalHistoryHandler, indicatorHandler, indicatorHistoryHandler, strategyHandler, strategyHistoryHandler } from '@/db/dexieHandler'
import { GoalArraySchema, GoalSchema, PartialGoalSchema } from '@/lib/validators/goal'
import { Goal, Prisma } from '@prisma/client'
import { SyncService } from '@/services/sync'
import { Status } from '@/app/types/types'

const create = async (data: Prisma.GoalCreateInput): Promise<Goal> => {
  const parsedData = { ...GoalSchema.parse(data), planId: data.plan.connect!.id! }

  if (!SyncService.isEnabled) {
    await goalHandler.create(parsedData)
    return parsedData
  }

  const response = await fetch('/api/goal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create goal')
  }

  await goalHandler.create(parsedData)
  return parsedData
}

const createBulk = async (goals: Prisma.GoalCreateManyInput[]): Promise<Goal[]> => {
  const parsedData = GoalArraySchema.parse(goals)

  if (!SyncService.isEnabled) {
    await goalHandler.createMany(parsedData)
    return parsedData
  }

  const response = await fetch('/api/goal/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create goals')
  }

  await goalHandler.createMany(parsedData)
  return parsedData
}

const get = async (id: string): Promise<Goal | null> => {
  const goal = await goalHandler.findOne(id)
  if (goal) return goal

  if (!SyncService.isEnabled) return null

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
}

const getByPlanId = async (planId: string, status = Status.ACTIVE): Promise<Goal[]> => {
  const goals = await goalHandler.findMany({ planId, status })
  if (goals?.length > 0) return goals

  if (!SyncService.isEnabled) return []

  const response = await fetch(`/api/goal?planId=${planId}&status=${status}`)
  if (!response.ok) return []

  const remoteGoals = await response.json()
  if (remoteGoals.length > 0) {
    try {
      await goalHandler.createMany(remoteGoals)
    } catch (error) {
      console.error('Error creating goals:', error)
    }
  }

  return remoteGoals
}


const update = async (id: string, goal: Prisma.GoalUpdateInput): Promise<Partial<Goal>> => {
  const parsedData = PartialGoalSchema.parse(goal)

  if (!SyncService.isEnabled) {
    await goalHandler.update(id, parsedData as Goal)
    return { ...parsedData, id }
  }

  const response = await fetch(`/api/goal/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update goal')
  }

  await goalHandler.update(id, parsedData)
  return parsedData
}

const deleteItem = async (id: string): Promise<void> => {
  const strategies = await strategyHandler.findMany({ goalId: id })
  const indicators = await indicatorHandler.findMany({ goalId: id })

  // Delete all related histories locally
  for (const strategy of strategies) {
    await strategyHistoryHandler.deleteMany({ strategyId: strategy.id })
  }

  for (const indicator of indicators) {
    await indicatorHistoryHandler.deleteMany({ indicatorId: indicator.id })
  }

  // Delete strategies and indicators
  for (const strategy of strategies) {
    await strategyHandler.delete(strategy.id)
  }

  for (const indicator of indicators) {
    await indicatorHandler.delete(indicator.id)
  }

  // Delete goal history locally
  await goalHistoryHandler.deleteMany({ goalId: id })

  // Delete the goal
  await goalHandler.delete(id)
}

export const GoalService = {
  create,
  createBulk,
  get,
  getByPlanId,
  update,
  deleteItem,
}
