import { Prisma, Strategy } from '@prisma/client'

const create = (strategy: Prisma.StrategyCreateInput): Promise<Strategy> => {
  return fetch(`/api/strategy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategy),
  }).then(response => response.json())
}

const get = async (id: string): Promise<Strategy> => {
  return fetch(`/api/strategy/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string): Promise<Strategy[]> => {
  return fetch(`/api/strategy?planId=${planId}`).then(response => response.json())
}

const getByGoalId = async (goalId: string): Promise<Strategy[]> => {
  return fetch(`/api/strategy?goalId=${goalId}`).then(response => response.json())
}

const update = async (id: string, strategy: Prisma.IndicatorUpdateInput): Promise<Strategy> => {
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
  getByGoalId,
  update,
}
