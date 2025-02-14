import { Status } from '@/app/types/types'
import { goalHandler } from '@/db/dexieHandler'
import { GoalArraySchema, GoalSchema, PartialGoalSchema } from '@/lib/validators/goal'
import { Goal, Prisma } from '@prisma/client'

const ENABLE_CLOUD_SYNC = process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC

const create = async (goal: Prisma.GoalCreateInput) => {
  const parsedData = { ...GoalSchema.parse(goal), planId: goal.plan.connect!.id! }
  await goalHandler.create(parsedData)

  if (!ENABLE_CLOUD_SYNC) {
    return parsedData
  }

  return fetch(`/api/goal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })
    .then(response => response.json())
}

const createBulk = async (goals: Prisma.GoalCreateManyInput[]) => {
  const parsedData = GoalArraySchema.parse(goals)
  await goalHandler.createMany(parsedData)

  if (!ENABLE_CLOUD_SYNC) {
    return parsedData
  }

  return fetch(`/api/goal/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })
    .then(response => response.json())
}

const get = async (id: string): Promise<Goal | null> => {
  const goal = await goalHandler.findOne(id)

  if (goal) {
    return goal
  }

  if (!ENABLE_CLOUD_SYNC) {
    return null
  }

  return fetch(`/api/goal/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string, status = Status.ACTIVE): Promise<Goal[]> => {
  const goals = await goalHandler.findMany({ planId, status })

  if (goals) {
    return goals as Goal[]
  }

  if (!ENABLE_CLOUD_SYNC) {
    return []
  }

  return fetch(`/api/goal?planId=${planId}&status=${status}`).then(response => response.json())
}

const update = async (id: string, goal: Prisma.GoalUpdateInput): Promise<Goal> => {
  const parsedData = PartialGoalSchema.parse(goal)
  await goalHandler.update(id, parsedData)

  if (!ENABLE_CLOUD_SYNC) {
    return goal as Goal
  }

  return fetch(`/api/goal/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  })
    .then(response => response.json())
    .then(async (response) => {
      await goalHandler.update(id, parsedData)
      return response
    })
}

const deleteItem = async (id: string) => {
  await goalHandler.delete(id)

  if (!ENABLE_CLOUD_SYNC) {
    return
  }

  return fetch(`/api/goal/${id}`, { method: 'DELETE' })
}

export const GoalService = {
  create,
  createBulk,
  get,
  getByPlanId,
  update,
  deleteItem,
}
