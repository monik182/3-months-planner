import { strategies } from '@prisma/client'

const create = (strategy: strategies) => {
  return fetch(`/api/strategy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategy),
  }).then(response => response.json())
}

const get = async (id: string) => {
  return fetch(`/api/strategy/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string) => {
  return fetch(`/api/strategy?planId=${planId}`).then(response => response.json())
}

const update = async (id: string, strategy: Partial<strategies>) => {
  return fetch(`/api/strategy/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategy),
  }).then(response => response.json())
}

// const deleteStrategy = async (id: string) => {
//   return fetch(`/api/strategy/${id}`, {
//     method: 'DELETE',
//   }).then(response => response.json())
// }

export const StrategyService = {
  create,
  get,
  getByPlanId,
  update,
}
