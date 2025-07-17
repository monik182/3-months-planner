import { GoalHistoryExtended, Status } from '@/app/types/types'
import { Prisma, GoalHistory } from '@prisma/client'
import { GoalHistorySchema, PartialGoalHistorySchema, GoalHistoryNoGoalArraySchema } from '@/lib/validators/goalHistory'

const create = async (data: Prisma.GoalHistoryCreateInput): Promise<GoalHistory> => {
  const parsedData = GoalHistorySchema.parse(data)

  const response = await fetch('/api/goal/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create goal history')
  }

  return parsedData
}

const createBulk = async (histories: Prisma.GoalHistoryCreateManyInput[]): Promise<GoalHistory[]> => {
  const parsedData = GoalHistoryNoGoalArraySchema.parse(histories)

  const response = await fetch('/api/goal/history/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create goal histories')
  }

  return parsedData
}

const get = async (id: string): Promise<GoalHistory | null> => {
  const response = await fetch(`/api/goal/history/${id}`)
  if (!response.ok) {
    console.error(`Failed to fetch goal history ${id} from remote:`, response.status)
    return null
  }

  const remoteHistory = await response.json()
  return remoteHistory
}

const getByPlanId = async (planId: string, sequence?: number, status = Status.ACTIVE): Promise<GoalHistoryExtended[]> => {
  const url = new URL('/api/goal/history', window.location.origin)
  url.searchParams.append('planId', planId)
  if (sequence !== undefined) url.searchParams.append('sequence', sequence.toString())
  url.searchParams.append('status', status)

  const response = await fetch(url.toString())
  if (!response.ok) {
    return []
  }

  const remoteHistories = await response.json()
  return remoteHistories
}

const update = async (id: string, history: Prisma.GoalHistoryUpdateInput): Promise<Partial<GoalHistory>> => {
  const parsedData = PartialGoalHistorySchema.omit({ id: true }).parse(history)

  const response = await fetch(`/api/goal/history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update goal history')
  }

  return response.json()
}

const deleteItem = async (id: string): Promise<void> => {
  const response = await fetch(`/api/goal/history/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete goal history')
  }
}

export const GoalHistoryService = {
  create,
  createBulk,
  get,
  getByPlanId,
  update,
  deleteItem,
}
