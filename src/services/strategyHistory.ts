import { StrategyHistoryExtended, Status } from '@/app/types/types'
import { Prisma, StrategyHistory } from '@prisma/client'
import { StrategyHistorySchema, PartialStrategyHistorySchema, StrategyHistoryNoStrategyArraySchema } from '@/lib/validators/strategyHistory'

const create = async (data: Prisma.StrategyHistoryCreateInput): Promise<StrategyHistory> => {
  const parsedData = StrategyHistorySchema.parse(data)

  const response = await fetch('/api/strategy/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create action history')
  }

  return response.json()
}

const createBulk = async (histories: Prisma.StrategyHistoryCreateManyInput[]): Promise<StrategyHistory[]> => {
  const parsedData = StrategyHistoryNoStrategyArraySchema.parse(histories)

  const response = await fetch('/api/strategy/history/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create action histories')
  }

  return response.json()
}

const get = async (id: string): Promise<StrategyHistory | null> => {

  const response = await fetch(`/api/strategy/history/${id}`)
  if (!response.ok) {
    console.error(`Failed to fetch action history ${id} from remote:`, response.status)
    return null
  }

  const remoteHistory = await response.json()
  return remoteHistory
}

const getByPlanId = async (planId: string, sequence?: string, status = Status.ACTIVE): Promise<StrategyHistoryExtended[]> => {
  const url = new URL('/api/strategy/history', window.location.origin)
  url.searchParams.append('planId', planId)
  if (sequence !== undefined) url.searchParams.append('sequence', sequence)
  url.searchParams.append('status', status)

  const response = await fetch(url.toString())
  if (!response.ok) {
    return []
  }

  const remoteHistories = await response.json()
  return remoteHistories
}

const getByGoalId = async (goalId: string, sequence?: number, status = Status.ACTIVE): Promise<StrategyHistoryExtended[]> => {
  const url = new URL('/api/strategy/history', window.location.origin)
  url.searchParams.append('goalId', goalId)
  if (sequence !== undefined) url.searchParams.append('sequence', sequence.toString())
  url.searchParams.append('status', status)

  const response = await fetch(url.toString())
  if (!response.ok) {
    return []
  }

  const remoteHistories = await response.json()
  return remoteHistories
}

const update = async (id: string, history: Prisma.StrategyHistoryUpdateInput): Promise<Partial<StrategyHistory>> => {
  const parsedData = PartialStrategyHistorySchema.omit({ id: true }).parse(history)

  const response = await fetch(`/api/strategy/history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update action history')
  }

  return response.json()
}

const deleteItem = async (id: string): Promise<void> => {
  const response = await fetch(`/api/strategy/history/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete action history')
  }

}

export const StrategyHistoryService = {
  create,
  createBulk,
  get,
  getByPlanId,
  getByGoalId,
  update,
  deleteItem,
}
