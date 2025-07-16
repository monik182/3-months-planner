import { PartialPlanSchema, PlanSchema } from '@/lib/validators/plan'
import { Plan, Prisma } from '@prisma/client'

const getByUserId = async (userId: string): Promise<Plan | null> => {
  const response = await fetch(`/api/plan?userId=${userId}`, {
    method: 'GET',
  })
  const remotePlan = await response.json()
  return remotePlan
}

const create = async (data: Prisma.PlanCreateInput): Promise<Plan> => {
  const parsedData = PlanSchema.omit({ id: true }).parse(data)

  const response = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create plan')
  }

  const remotePlan = await response.json()
  return remotePlan
}

const get = async (id: string): Promise<Plan | null> => {
  const response = await fetch(`/api/plan/${id}`)
  if (!response.ok) {
    return null
  }

  const remotePlan = await response.json()
  return remotePlan
}

const getAll = async (userId: string): Promise<Plan[]> => {
  const response = await fetch(`/api/plan/all?userId=${userId}`, {
    method: 'GET',
  })
  const remotePlans = await response.json()
  return remotePlans
}

const update = async (id: string, plan: Prisma.PlanUpdateInput): Promise<Partial<Plan>> => {
  const parsedData = PartialPlanSchema.parse(plan)

  const response = await fetch(`/api/plan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update plan')
  }

  return parsedData
}

export const PlanService = {
  create,
  get,
  getByUserId,
  getAll,
  update,
}
