import { indicatorHandler } from '@/db/dexieHandler'
import { IndicatorSchema, PartialIndicatorSchema } from '@/lib/validators/indicator'
import { Indicator, Prisma } from '@prisma/client'

const ENABLE_CLOUD_SYNC = process.env.ENABLE_CLOUD_SYNC

const create = async (indicator: Prisma.IndicatorCreateInput): Promise<Indicator> => {
  const parsedData = IndicatorSchema.parse(indicator)
  if (!ENABLE_CLOUD_SYNC) {
    await indicatorHandler.create(parsedData)
    return parsedData
  }

  return fetch(`/api/indicator`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  })
    .then(response => response.json())
    .then(async (response) => {
      await indicatorHandler.create(parsedData)
      return response
    })
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
  if (!ENABLE_CLOUD_SYNC) {
    await indicatorHandler.update(id, parsedData)
    return parsedData as Indicator
  }

  return fetch(`/api/indicator/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  })
    .then(response => response.json())
    .then(async (response) => {
      await indicatorHandler.update(id, parsedData)
      return response
    })
}

export const IndicatorService = {
  create,
  get,
  getByPlanId,
  getByGoalId,
  update,
}
