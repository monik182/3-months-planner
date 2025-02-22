import { goalHistoryHandler } from '@/db/dexieHandler'
import { GoalHistoryExtended } from '@/app/types/types'
import { Prisma, GoalHistory } from '@prisma/client'
import { GoalHistorySchema, PartialGoalHistorySchema } from '@/lib/validators/goalHistory'

const ENABLE_CLOUD_SYNC = JSON.parse(process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC || '')

const create = async (goal: Prisma.GoalHistoryCreateInput): Promise<GoalHistory> => {
  const parsedData = GoalHistorySchema.parse(goal)
  await goalHistoryHandler.create(parsedData)

  if (!ENABLE_CLOUD_SYNC) {
    return parsedData
  }

  return fetch(`/api/goal/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })
    .then(response => response.json())
}

const get = async (id: string): Promise<GoalHistory | null> => {
  const history = await goalHistoryHandler.findOne(id)
  if (history) {
    return history
  }

  if (!ENABLE_CLOUD_SYNC) {
    return null
  }

  return fetch(`/api/goal/history/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string, sequence?: number, status?: string): Promise<GoalHistoryExtended[]> => {
  const history = await goalHistoryHandler.findMany({ planId, status }, { sequence })
  if (history) {
    return history as GoalHistoryExtended[]
  }

  if (!ENABLE_CLOUD_SYNC) {
    return []
  }

  return fetch(`/api/goal/history?planId=${planId}&sequence=${sequence}&status=${status}`).then(response => response.json())
}

const update = async (id: string, goal: Prisma.GoalHistoryUpdateInput): Promise<GoalHistory> => {
  const parsedData = PartialGoalHistorySchema.parse(goal)
  await goalHistoryHandler.update(id, parsedData)

  if (!ENABLE_CLOUD_SYNC) {
    return goal as GoalHistory
  }

  return fetch(`/api/goal/history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  })
    .then(response => response.json())
}

export const GoalHistoryService = {
  create,
  get,
  getByPlanId,
  update,
}
