import { StrategyHistoryExtended } from '@/app/types/types'
import { Prisma, StrategyHistory } from '@prisma/client'

const create = (strategy: Prisma.StrategyHistoryCreateInput): Promise<StrategyHistory> => {
  return fetch(`/api/strategy/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategy),
  }).then(response => response.json())
}

const get = async (id: string): Promise<StrategyHistory> => {
  return fetch(`/api/strategy/history/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string, sequence?: string): Promise<StrategyHistoryExtended[]> => {
  return fetch(`/api/strategy/history?planId=${planId}&sequence=${sequence}`).then(response => response.json())
}

const getByGoalId = async (goalId: string, sequence?: string): Promise<StrategyHistoryExtended[]> => {
  return fetch(`/api/strategy/history?goalId=${goalId}&sequence=${sequence}`).then(response => response.json())
}

const update = async (id: string, strategy: Prisma.StrategyHistoryUpdateInput): Promise<StrategyHistory> => {
  return fetch(`/api/strategy/history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(strategy),
  }).then(response => response.json())
}

// const deleteStrategy = async (id: string) => {
//   return fetch(`/api/strategy/history/${id}`, {
//     method: 'DELETE',
//   }).then(response => response.json())
// }

export const StrategyHistoryService = {
  create,
  get,
  getByPlanId,
  getByGoalId,
  update,
}
