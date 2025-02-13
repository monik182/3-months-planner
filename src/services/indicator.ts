import { indicatorHandler } from '@/db/dexieHandler'
import { IndicatorSchema, PartialIndicatorSchema } from '@/lib/validators/indicator'
import { Indicator, Prisma } from '@prisma/client'

const ENABLE_CLOUD_SYNC = process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC

const create = async (indicator: Prisma.IndicatorCreateInput): Promise<Indicator> => {
  const parsedData = IndicatorSchema.parse(indicator)
  await indicatorHandler.create(parsedData)

  if (!ENABLE_CLOUD_SYNC) {
    return parsedData
  }

  return fetch(`/api/indicator`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })
    .then(response => response.json())
}

const get = async (id: string): Promise<Indicator | null> => {
  const indicator = await indicatorHandler.findOne(id)

  if (indicator) {
    return indicator
  }

  if (!ENABLE_CLOUD_SYNC) {
    return null
  }

  return fetch(`/api/indicator/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string): Promise<Indicator[]> => {
  const indicators = await indicatorHandler.findMany({ planId })

  if (indicators) {
    return indicators
  }

  if (!ENABLE_CLOUD_SYNC) {
    return []
  }

  return fetch(`/api/indicator?planId=${planId}`).then(response => response.json())
}

const getByGoalId = async (goalId: string): Promise<Indicator[]> => {
  const indicators = await indicatorHandler.findMany({ goalId })

  if (indicators) {
    return indicators
  }

  if (!ENABLE_CLOUD_SYNC) {
    return []
  }

  return fetch(`/api/indicator?goalId=${goalId}`).then(response => response.json())
}

const update = async (id: string, indicator: Prisma.IndicatorUpdateInput): Promise<Indicator> => {
  const parsedData = PartialIndicatorSchema.parse(indicator)
  await indicatorHandler.update(id, parsedData)

  if (!ENABLE_CLOUD_SYNC) {
    return parsedData as Indicator
  }

  return fetch(`/api/indicator/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  })
    .then(response => response.json())
}

export const IndicatorService = {
  create,
  get,
  getByPlanId,
  getByGoalId,
  update,
}
