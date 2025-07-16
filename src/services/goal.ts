import { GoalArraySchema, GoalSchema, PartialGoalSchema } from '@/lib/validators/goal'
import { Goal, Prisma } from '@prisma/client'
import { Status } from '@/app/types/types'

const create = async (data: Prisma.GoalCreateInput): Promise<Goal> => {
  const parsedData = { ...GoalSchema.omit({ id: true }).parse(data), planId: data.plan.connect!.id! }

  const response = await fetch('/api/goal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create goal')
  }

  const remoteGoal = await response.json()
  return remoteGoal
}

const createBulk = async (goals: Prisma.GoalCreateManyInput[]): Promise<Goal[]> => {
  const parsedData = GoalArraySchema.omit({ id: true }).parse(goals)
  const response = await fetch('/api/goal/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create goals')
  }

  const remoteGoals = await response.json()
  return remoteGoals
}

const get = async (id: string): Promise<Goal | null> => {
  const response = await fetch(`/api/goal/${id}`)
  if (!response.ok) {
    console.error(`Failed to fetch goal ${id} from remote:`, response.status)
    return null
  }

  const remoteGoal = await response.json()
  return remoteGoal
}

const getByPlanId = async (planId: string, status = Status.ACTIVE): Promise<Goal[]> => {
  const response = await fetch(`/api/goal?planId=${planId}&status=${status}`)
  if (!response.ok) return []

  const remoteGoals = await response.json()
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

  return parsedData
}

const deleteItem = async (id: string): Promise<void> => {
  const response = await fetch(`/api/goal/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete goal')
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
