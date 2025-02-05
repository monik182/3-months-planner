import { Status } from '@/app/types/types'
import { goalHandler } from '@/db/dexieHandler'
import { GoalArraySchema, GoalSchema, PartialGoalSchema } from '@/lib/validators/goal'
import { Goal, Prisma } from '@prisma/client'

const ENABLE_CLOUD_SYNC = process.env.ENABLE_CLOUD_SYNC

const create = async (goal: Prisma.GoalCreateInput) => {
  const parsedData = { ...GoalSchema.parse(goal), planId: goal.plan.connect!.id! }
  if (!ENABLE_CLOUD_SYNC) {
    await goalHandler.create(parsedData)
    return parsedData
  }

  return fetch(`/api/goal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  })
    .then(response => response.json())
    .then(async (response) => {
      await goalHandler.create(parsedData)
      return response
    })
}

const createBulk = async (goals: Prisma.GoalCreateManyInput[]) => {
  const parsedData = GoalArraySchema.parse(goals)

  if (!ENABLE_CLOUD_SYNC) {
    await goalHandler.createMany(parsedData)
    return parsedData
  }

  return fetch(`/api/goal/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goals),
  })
    .then(response => response.json())
    .then(async (response) => {
      await goalHandler.createMany(parsedData)
      return response
    })
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

const getByPlanId = async (planId: string, status?: Status): Promise<Goal[]> => {
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

  if (!ENABLE_CLOUD_SYNC) {
    await goalHandler.update(id, parsedData)
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

export const GoalService = {
  create,
  createBulk,
  get,
  getByPlanId,
  update,
}
