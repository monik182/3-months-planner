import { goals, indicators, plans, strategies } from '@prisma/client'

interface PlanData {
  plan: plans,
  goals: goals
  strategies: strategies
  indicators: indicators
}

const getByUserId = async (userId: string) => {
  const response = await fetch(`/api/plan?userId=${userId}`, {
    method: 'GET',
  })
  const plan = await response.json()
  return plan
}

const create = async (data: PlanData) => {
  return fetch(`/api/plan/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(response => response.json())
}

const get = async (id: string) => {
  return fetch(`/api/plan/${id}`).then(response => response.json())
}

const getAll = async (userId: string) => {
  const response = await fetch(`/api/plan/all?userId=${userId}`, {
    method: 'GET',
  })
  const plans = await response.json()
  return plans
}

const update = async (id: string, plan: Partial<plans>) => {
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
