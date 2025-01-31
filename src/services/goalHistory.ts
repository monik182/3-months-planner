import { GoalHistoryExtended } from '@/app/types/types'
import { GoalHistory, Prisma } from '@prisma/client'

const create = (goal: Prisma.GoalHistoryCreateInput) => {
  return fetch(`/api/goal/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  }).then(response => response.json())
}

const get = async (id: string): Promise<GoalHistory> => {
  return fetch(`/api/goal/history/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string, sequence?: string, status?: string): Promise<GoalHistoryExtended[]> => {
  return fetch(`/api/goal/history?planId=${planId}&sequence=${sequence}&status=${status}`).then(response => response.json())
}

const update = async (id: string, goal: Prisma.GoalHistoryUpdateInput): Promise<GoalHistory> => {
  return fetch(`/api/goal/history/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  }).then(response => response.json())
}

// const delete = async (id: string) => {
//   return fetch(`/api/goal/history/${id}`, {
//     method: 'DELETE',
//   }).then(response => response.json())
// }

export const GoalHistoryService = {
  create,
  get,
  getByPlanId,
  update,
}
