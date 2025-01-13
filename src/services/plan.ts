import { Goal, Indicator, Plan, Strategy } from '@prisma/client'

interface PlanData {
  plan: Plan
  goals: Goal[]
  strategies: Strategy[]
  indicators: Indicator[]
}

const getByUserId = async (userId: string): Promise<Plan> => {
  const response = await fetch(`/api/plan?userId=${userId}`, {
    method: 'GET',
  })
  const plan = await response.json()
  return plan
}

const create = async (data: PlanData) => {
  const body = JSON.stringify(data)
  return fetch(`/api/plan/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
    .then(response => response.json())
}

const get = async (id: string): Promise<Plan> => {
  return fetch(`/api/plan/${id}`).then(response => response.json())
}

const getAll = async (userId: string): Promise<Plan[]> => {
  const response = await fetch(`/api/plan/all?userId=${userId}`, {
    method: 'GET',
  })
  const plan = await response.json()
  return plan
}

const update = async (id: string, plan: Partial<Plan>): Promise<Plan> => {
  return fetch(`/api/plan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan),
  }).then(response => response.json())
}

export const PlanService = {
  create,
  get,
  getByUserId,
  getAll,
  update,
}
