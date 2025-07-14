import { GoalArraySchema, GoalSchema, PartialGoalSchema } from '@/lib/validators/goal'
import { Goal, Prisma } from '@prisma/client'
import { Status } from '@/app/types/types'
import { getCachedData, setCachedData } from '@/lib/cache'

const create = async (data: Prisma.GoalCreateInput): Promise<Goal> => {
  const parsedData = { ...GoalSchema.parse(data), planId: data.plan.connect!.id! }

  const response = await fetch('/api/goal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create goal')
  }

  const cacheKey = `goals:${parsedData.planId}`
  const cached = getCachedData<Goal[]>(cacheKey) || []
  setCachedData(cacheKey, [...cached, parsedData as Goal])

  return parsedData
}

const createBulk = async (goals: Prisma.GoalCreateManyInput[]): Promise<Goal[]> => {
  const parsedData = GoalArraySchema.parse(goals)
  const response = await fetch('/api/goal/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create goals')
  }

  const planId = goals[0]?.planId
  if (planId) {
    const cacheKey = `goals:${planId}`
    const cached = getCachedData<Goal[]>(cacheKey) || []
    setCachedData(cacheKey, [...cached, ...parsedData as Goal[]])
  }

  return parsedData
}

const get = async (id: string): Promise<Goal | null> => {
  const cacheKey = `goal:${id}`
  const cached = getCachedData<Goal>(cacheKey)
  if (cached) return cached

  const response = await fetch(`/api/goal/${id}`)
  if (!response.ok) {
    console.error(`Failed to fetch goal ${id} from remote:`, response.status)
    return null
  }

  const remoteGoal = await response.json()
  if (remoteGoal) setCachedData(cacheKey, remoteGoal)
  return remoteGoal
}

const getByPlanId = async (planId: string, status = Status.ACTIVE): Promise<Goal[]> => {
  const cacheKey = `goals:${planId}`
  const cached = getCachedData<Goal[]>(cacheKey)
  if (cached) return cached

  const response = await fetch(`/api/goal?planId=${planId}&status=${status}`)
  if (!response.ok) return []

  const remoteGoals = await response.json()
  setCachedData(cacheKey, remoteGoals)
  return remoteGoals
}


const update = async (id: string, goal: Prisma.GoalUpdateInput): Promise<Partial<Goal>> => {
  const parsedData = PartialGoalSchema.parse(goal)

  const response = await fetch(`/api/goal/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update goal')
  }

  const cacheKey = `goal:${id}`
  const data = { ...(getCachedData<Goal>(cacheKey) || {}), ...parsedData } as Goal
  setCachedData(cacheKey, data)
  if (goal.planId) {
    const listKey = `goals:${goal.planId}`
    const list = getCachedData<Goal[]>(listKey)
    if (list) {
      setCachedData(listKey, list.map(g => g.id === id ? { ...g, ...parsedData } as Goal : g))
    }
  }

  return parsedData
}

const deleteItem = async (id: string): Promise<void> => {
  const response = await fetch(`/api/goal/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete goal')
  }

  const cacheKey = `goal:${id}`
  const goal = getCachedData<Goal>(cacheKey)
  setCachedData(cacheKey, null as any)
  if (goal?.planId) {
    const listKey = `goals:${goal.planId}`
    const list = getCachedData<Goal[]>(listKey)
    if (list) {
      setCachedData(listKey, list.filter(g => g.id !== id))
    }
  }
}

export const GoalService = {
  create,
  createBulk,
  get,
  getByPlanId,
  update,
  deleteItem,
}
