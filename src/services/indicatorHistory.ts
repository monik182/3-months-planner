import { indicatorHistoryHandler } from '@/db/dexieHandler'
import { IndicatorHistoryExtended } from '@/app/types/types'
import { IndicatorHistory, Prisma } from '@prisma/client'
import { IndicatorHistorySchema, PartialIndicatorHistorySchema } from '@/lib/validators/indicatorHistory'

const ENABLE_CLOUD_SYNC = process.env.ENABLE_CLOUD_SYNC

const create = async (indicator: Prisma.IndicatorHistoryCreateInput): Promise<IndicatorHistory> => {
  const parsedData = IndicatorHistorySchema.parse(indicator)
  if (!ENABLE_CLOUD_SYNC) {
    await indicatorHistoryHandler.create(parsedData)
    return parsedData
  }

  return fetch(`/api/indicator/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  })
    .then(response => response.json())
    .then(async (response) => {
      await indicatorHistoryHandler.create(parsedData)
      return response
    })
}

const get = async (id: string): Promise<IndicatorHistory | null> => {
  const history = await indicatorHistoryHandler.findOne(id)
  if (history) {
    return history
  }

  if (!ENABLE_CLOUD_SYNC) {
    return null
  }

  return fetch(`/api/indicator/history/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string, sequence?: number): Promise<IndicatorHistoryExtended[]> => {
  const history = await indicatorHistoryHandler.findMany({ planId }, { sequence })
  if (history) {
    return history as IndicatorHistoryExtended[]
  }

  if (!ENABLE_CLOUD_SYNC) {
    return []
  }

  return fetch(`/api/indicator/history?planId=${planId}&sequence=${sequence}`).then(response => response.json())
}

const getByGoalId = async (goalId: string, sequence?: number): Promise<IndicatorHistoryExtended[]> => {
  const history = await indicatorHistoryHandler.findManyByGoalId({ goalId }, { sequence })
  if (history) {
    return history as IndicatorHistoryExtended[]
  }

  if (!ENABLE_CLOUD_SYNC) {
    return []
  }

  return fetch(`/api/indicator/history?goalId=${goalId}&sequence=${sequence}`).then(response => response.json())
}

const update = async (id: string, indicator: Prisma.IndicatorHistoryUpdateInput): Promise<IndicatorHistory> => {
  const parsedData = PartialIndicatorHistorySchema.parse(indicator)

  if (!ENABLE_CLOUD_SYNC) {
    await indicatorHistoryHandler.update(id, parsedData)
    return indicator as IndicatorHistory
  }

  return fetch(`/api/indicator/history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  })
    .then(response => response.json())
    .then(async (response) => {
      await indicatorHistoryHandler.update(id, parsedData)
      return response
    })
}

export const IndicatorHistoryService = {
  create,
  get,
  getByPlanId,
  getByGoalId,
  update,
}
