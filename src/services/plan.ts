import { PartialPlanSchema, PlanSchema } from '@/lib/validators/plan'
import { Plan, Prisma } from '@prisma/client'
import { getCachedData, setCachedData, removeCachedData } from '@/lib/cache'

const getByUserId = async (userId: string): Promise<Plan | null> => {
  const cacheKey = `plan:${userId}`
  const cached = getCachedData<Plan>(cacheKey)
  if (cached) {
    return cached
  }

  const response = await fetch(`/api/plan?userId=${userId}`, {
    method: 'GET',
  })
  const remotePlan = await response.json()
  if (response.ok && remotePlan) {
    setCachedData(cacheKey, remotePlan)
  }
  return remotePlan
}

const create = async (data: Prisma.PlanCreateInput): Promise<Plan> => {
  const parsedData = PlanSchema.parse(data)

  const response = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create plan')
  }

  setCachedData(`plan:${parsedData.user.connect!.id}`, parsedData as Plan)

  return parsedData
}

const get = async (id: string): Promise<Plan | null> => {
  const cacheKey = `plan:id:${id}`
  const cached = getCachedData<Plan>(cacheKey)
  if (cached) return cached

  const response = await fetch(`/api/plan/${id}`)
  if (!response.ok) {
    return null
  }

  const remotePlan = await response.json()
  if (remotePlan) {
    setCachedData(cacheKey, remotePlan)
  }
  return remotePlan
}

const getAll = async (userId: string): Promise<Plan[]> => {
  const cacheKey = `plans:${userId}`
  const cached = getCachedData<Plan[]>(cacheKey)
  if (cached) return cached

  const response = await fetch(`/api/plan/all?userId=${userId}`, {
    method: 'GET',
  })
  const remotePlans = await response.json()
  if (response.ok) {
    setCachedData(cacheKey, remotePlans)
  }
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

  const cacheKey = `plan:id:${id}`
  const data = { ...(getCachedData<Plan>(cacheKey) || {}), ...parsedData } as Plan
  setCachedData(cacheKey, data)
  return parsedData
}

export const PlanService = {
  create,
  get,
  getByUserId,
  getAll,
  update,
}
