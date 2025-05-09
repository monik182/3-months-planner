import { StrategyArraySchema, PartialStrategySchema, StrategyNoGoalSchema } from '@/lib/validators/strategy'
import { Strategy, Prisma } from '@prisma/client'
import { Status } from '@/app/types/types'

const create = async (data: Strategy): Promise<Strategy> => {
  const parsedData = StrategyNoGoalSchema.parse(data)

  const response = await fetch('/api/strategy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create strategy')
  }

  return parsedData
}

const createBulk = async (strategies: Strategy[]): Promise<Strategy[]> => {
  const parsedData = StrategyArraySchema.parse(strategies)

  const response = await fetch('/api/strategy/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create strategies')
  }

  return parsedData
}

const get = async (id: string): Promise<Strategy | null> => {

  const response = await fetch(`/api/strategy/${id}`)
  if (!response.ok) {
    console.error(`Failed to fetch strategy ${id} from remote:`, response.status)
    return null
  }

  const remoteStrategy = await response.json()
  return remoteStrategy
}

const getByPlanId = async (planId: string, status = Status.ACTIVE): Promise<Strategy[]> => {
  const response = await fetch(`/api/strategy?planId=${planId}&status=${status}`)
  if (!response.ok) {
    return []
  }

  const remoteStrategies = await response.json()
  return remoteStrategies
}

const getByGoalId = async (goalId: string, status = Status.ACTIVE): Promise<Strategy[]> => {
  const response = await fetch(`/api/strategy?goalId=${goalId}&status=${status}`)
  if (!response.ok) {
    return []
  }

  const remoteStrategies = await response.json()
  return remoteStrategies
}

const update = async (id: string, strategy: Prisma.StrategyUpdateInput): Promise<Partial<Strategy>> => {
  const parsedData = PartialStrategySchema.parse(strategy)

  const response = await fetch(`/api/strategy/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update strategy')
  }

  return parsedData
}

const deleteItem = async (id: string): Promise<void> => {
  const response = await fetch(`/api/strategy/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete strategy')
  }
}

export const StrategyService = {
  create,
  createBulk,
  get,
  getByPlanId,
  getByGoalId,
  update,
  deleteItem,
}
