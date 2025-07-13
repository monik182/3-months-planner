import { PartialIndicatorSchema, IndicatorNoGoalSchema, IndicatorNoGoalArraySchema, IndicatorNoGoalSchemaType, IndicatorNoGoalArraySchemaType, PartialIndicatorSchemaType } from '@/lib/validators/indicator'
import { Indicator } from '@/app/types/models'
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

  return parsedData
}

const createBulk = async (indicators: IndicatorNoGoalArraySchemaType): Promise<Indicator[]> => {
  const parsedData = IndicatorNoGoalArraySchema.parse(indicators)

  const response = await fetch('/api/indicator/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create indicators in bulk')
  }

  return parsedData
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

const update = async (id: string, indicator: PartialIndicatorSchemaType): Promise<Partial<Indicator>> => {
  const parsedData = PartialIndicatorSchema.parse(indicator)

  const response = await fetch(`/api/indicator/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update indicator')
  }

  return parsedData
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
