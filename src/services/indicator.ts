import { Indicator } from '@prisma/client'

const create = (indicator: Indicator): Promise<Indicator> => {
  return fetch(`/api/indicator`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  }).then(response => response.json())
}

const get = async (id: string): Promise<Indicator> => {
  return fetch(`/api/indicator/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string): Promise<Indicator[]> => {
  return fetch(`/api/indicator?planId=${planId}`).then(response => response.json())
}

const getByGoalId = async (goalId: string): Promise<Indicator[]> => {
  return fetch(`/api/indicator?goalId=${goalId}`).then(response => response.json())
}

const update = async (id: string, indicator: Partial<Indicator>): Promise<Indicator> => {
  return fetch(`/api/indicator/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  }).then(response => response.json())
}

// const delete = async (id: string) => {
//   return fetch(`/api/indicator/${id}`, {
//     method: 'DELETE',
//   }).then(response => response.json())
// }

export const IndicatorService = {
  create,
  get,
  getByPlanId,
  getByGoalId,
  update,
}
