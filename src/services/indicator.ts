import { PartialIndicatorSchema, IndicatorNoGoalSchema, IndicatorNoGoalArraySchema } from '@/lib/validators/indicator'
import { Indicator, Prisma } from '@prisma/client'
import { Status } from '@/app/types/types'

const create = async (data: Indicator): Promise<Indicator> => {
  const parsedData = IndicatorNoGoalSchema.parse(data)

  const response = await fetch('/api/indicator', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create indicator')
  }

  const remoteIndicator = await response.json()
  return remoteIndicator
}

const createBulk = async (indicators: Prisma.IndicatorCreateManyInput[]): Promise<Indicator[]> => {
  const parsedData = IndicatorNoGoalArraySchema.parse(indicators)

  const response = await fetch('/api/indicator/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create indicators in bulk')
  }

  const remoteIndicators = await response.json()
  return remoteIndicators
}

const get = async (id: string): Promise<Indicator | null> => {
  try {

    const response = await fetch(`/api/indicator/${id}`)
    if (!response.ok) {
      console.error(`Failed to fetch indicator ${id} from remote:`, response.status)
      return null
    }

    const remoteIndicator = await response.json()
    return remoteIndicator
  } catch (error) {
    console.error(`Error fetching indicator ${id}:`, error)
    return null
  }
}

const getByPlanId = async (planId: string, status = Status.ACTIVE): Promise<Indicator[]> => {

  const response = await fetch(`/api/indicator?planId=${planId}&status=${status}`)
  if (!response.ok) {
    return []
  }

  const remoteIndicators = await response.json()
  return remoteIndicators
}

const getByGoalId = async (goalId: string, status = Status.ACTIVE): Promise<Indicator[]> => {
  const response = await fetch(`/api/indicator?goalId=${goalId}&status=${status}`)
  if (!response.ok) {
    return []
  }

  const remoteIndicators = await response.json()
  return remoteIndicators
}

const update = async (id: string, indicator: Prisma.IndicatorUpdateInput): Promise<Partial<Indicator>> => {
  const parsedData = PartialIndicatorSchema.omit({ id: true }).parse(indicator)

  const response = await fetch(`/api/indicator/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update indicator')
  }

  return response.json()
}

const deleteItem = async (id: string): Promise<void> => {

  const response = await fetch(`/api/indicator/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete indicator')
  }

}

export const IndicatorService = {
  create,
  createBulk,
  get,
  getByPlanId,
  getByGoalId,
  update,
  deleteItem,
}
