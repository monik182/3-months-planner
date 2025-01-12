import { indicators } from '@prisma/client'

const create = (indicator: indicators) => {
  return fetch(`/api/indicator`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(indicator),
  }).then(response => response.json())
}

const get = async (id: string) => {
  return fetch(`/api/indicator/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string) => {
  return fetch(`/api/indicator?planId=${planId}`).then(response => response.json())
}

const update = async (id: string, indicator: Partial<indicators>) => {
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
  update,
}
