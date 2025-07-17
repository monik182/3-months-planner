import { IndicatorHistoryExtended, Status } from '@/app/types/types'
import { IndicatorHistory, Prisma } from '@prisma/client'
import { IndicatorHistorySchema, PartialIndicatorHistorySchema, IndicatorHistoryNoIndicatorArraySchema } from '@/lib/validators/indicatorHistory'

const create = async (data: Prisma.IndicatorHistoryCreateInput): Promise<IndicatorHistory> => {
  const parsedData = IndicatorHistorySchema.parse(data)

  const response = await fetch('/api/indicator/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create indicator history')
  }

  return parsedData
}

const createBulk = async (histories: Prisma.IndicatorHistoryCreateManyInput[]): Promise<IndicatorHistory[]> => {
  const parsedData = IndicatorHistoryNoIndicatorArraySchema.parse(histories)

  const response = await fetch('/api/indicator/history/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create indicator histories')
  }

  return parsedData
}

const get = async (id: string): Promise<IndicatorHistory | null> => {

  const response = await fetch(`/api/indicator/history/${id}`)
  if (!response.ok) {
    console.error(`Failed to fetch indicator history ${id} from remote:`, response.status)
    return null
  }

  const remoteHistory = await response.json()
  return remoteHistory
}

const getByPlanId = async (planId: string, sequence?: number, status = Status.ACTIVE): Promise<IndicatorHistoryExtended[]> => {
  const url = new URL('/api/indicator/history', window.location.origin)
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

const getByGoalId = async (goalId: string, sequence?: number, status = Status.ACTIVE): Promise<IndicatorHistoryExtended[]> => {
  const url = new URL('/api/indicator/history', window.location.origin)
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

const update = async (id: string, history: Prisma.IndicatorHistoryUpdateInput): Promise<Partial<IndicatorHistory>> => {
  const parsedData = PartialIndicatorHistorySchema.omit({ id: true }).parse(history)

  const response = await fetch(`/api/indicator/history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update indicator history')
  }

  return response.json()
}

const deleteItem = async (id: string): Promise<void> => {
  const response = await fetch(`/api/indicator/history/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete indicator history')
  }

}

export const IndicatorHistoryService = {
  create,
  createBulk,
  get,
  getByPlanId,
  getByGoalId,
  update,
  deleteItem,
}
