import { GoalHistoryExtended, Status } from '@/app/types/types'
import { GoalHistory } from '@/app/types/models'
import { GoalHistorySchema, PartialGoalHistorySchema, GoalHistoryNoGoalArraySchema } from '@/lib/validators/goalHistory'

import { GoalHistorySchemaType, GoalHistoryNoGoalArraySchemaType, PartialGoalHistorySchemaType } from '@/lib/validators/goalHistory'

const create = async (data: GoalHistorySchemaType): Promise<GoalHistory> => {
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

const createBulk = async (histories: GoalHistoryNoGoalArraySchemaType): Promise<GoalHistory[]> => {
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

const update = async (id: string, history: PartialGoalHistorySchemaType): Promise<Partial<GoalHistory>> => {
  const parsedData = PartialGoalHistorySchema.parse(history)

  const response = await fetch(`/api/goal/history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update goal history')
  }

  return parsedData
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
