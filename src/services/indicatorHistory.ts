import { IndicatorHistoryExtended } from '@/app/types/types'
import { IndicatorHistory } from '@prisma/client'

const create = (indicator: IndicatorHistory): Promise<IndicatorHistory> => {
  return fetch(`/api/indicator/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  }).then(response => response.json())
}

const get = async (id: string): Promise<IndicatorHistory> => {
  return fetch(`/api/indicator/history/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string, sequence?: string): Promise<IndicatorHistoryExtended[]> => {
  return fetch(`/api/indicator/history?planId=${planId}&sequence=${sequence}`).then(response => response.json())
}

const getByGoalId = async (goalId: string, sequence?: string): Promise<IndicatorHistoryExtended[]> => {
  return fetch(`/api/indicator/history?goalId=${goalId}&sequence=${sequence}`).then(response => response.json())
}

const update = async (id: string, indicator: Partial<IndicatorHistory>): Promise<IndicatorHistory> => {
  return fetch(`/api/indicator/history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  }).then(response => response.json())
}

// const delete = async (id: string) => {
//   return fetch(`/api/indicator/history/${id}`, {
//     method: 'DELETE',
//   }).then(response => response.json())
// }

export const IndicatorHistoryService = {
  create,
  get,
  getByPlanId,
  getByGoalId,
  update,
}
