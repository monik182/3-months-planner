import { Status } from '@/app/types/types'
import { Goal, Prisma } from '@prisma/client'

const create = (goal: Prisma.GoalCreateInput) => {
  return fetch(`/api/goal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  }).then(response => response.json())
}

const createBulk = (goals: Prisma.GoalCreateManyInput[]) => {
  return fetch(`/api/goal/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goals),
  }).then(response => response.json())
}

const get = async (id: string): Promise<Goal> => {
  return fetch(`/api/goal/${id}`).then(response => response.json())
}

const getByPlanId = async (planId: string, status?: Status): Promise<Goal[]> => {
  return fetch(`/api/goal?planId=${planId}&status=${status}`).then(response => response.json())
}

const update = async (id: string, goal: Prisma.GoalUpdateInput): Promise<Goal> => {
  return fetch(`/api/goal/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  }).then(response => response.json())
}

// const deleteGoal = async (id: string) => {
//   return fetch(`/api/goal/${id}`, {
//     method: 'DELETE',
//   }).then(response => response.json())
// }

export const GoalService = {
  create,
  createBulk,
  get,
  getByPlanId,
  update,
}
