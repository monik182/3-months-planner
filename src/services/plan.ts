import { planHandler } from '@/db/dexieHandler'
import { PartialPlanSchema, PlanSchema } from '@/lib/validators/plan'
import { Plan, Prisma } from '@prisma/client'
import { SyncService } from '@/services/sync'
import { dexieToPlan, planToDexie } from '@/app/util'

const getByUserId = async (userId: string): Promise<Plan | null> => {
  const planLocal = await planHandler.findInProgress(userId)
  if (planLocal) {
    return dexieToPlan(planLocal)
  }

  if (!SyncService.isEnabled) {
    return null
  }

  const response = await fetch(`/api/plan?userId=${userId}`, {
    method: 'GET',
  })
  const remotePlan = await response.json()

  if (remotePlan) {
    try {
      await planHandler.create(planToDexie(remotePlan))
    } catch (error) {
      console.error('Error creating plan:', error)
    }
  }

  return remotePlan
}

const create = async (data: Prisma.PlanCreateInput): Promise<Plan> => {
  const parsedData = PlanSchema.parse(data)

  if (!SyncService.isEnabled) {
    await planHandler.create(planToDexie(parsedData))
    return parsedData
  }

  const response = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to create plan')
  }

  await planHandler.create(planToDexie(parsedData))
  return parsedData
}

const get = async (id: string): Promise<Plan | null> => {
  const plan = await planHandler.findOne(id)
  if (plan) {
    return dexieToPlan(plan)
  }

  if (!SyncService.isEnabled) {
    return null
  }

  const response = await fetch(`/api/plan/${id}`)
  if (!response.ok) {
    return null
  }

  const remotePlan = await response.json()
  try {
    await planHandler.create(planToDexie(remotePlan))
  } catch (error) {
    console.error('Error creating plan:', error)
  }
  return remotePlan
}

const getAll = async (userId: string): Promise<Plan[]> => {
  const plans = await planHandler.findMany({ userId })
  if (plans?.length > 0) {
    return plans.map(dexieToPlan)
  }

  if (!SyncService.isEnabled) {
    return []
  }

  const response = await fetch(`/api/plan/all?userId=${userId}`, {
    method: 'GET',
  })
  const remotePlans = await response.json()
  if (remotePlans?.length > 0) {
    try {
      await planHandler.createMany(remotePlans.map(planToDexie))
    } catch (error) {
      console.error('Error creating plans:', error)
    }
  }
  return remotePlans
}

const update = async (id: string, plan: Prisma.PlanUpdateInput): Promise<Partial<Plan>> => {
  const parsedData = PartialPlanSchema.parse(plan)

  if (!SyncService.isEnabled) {
    await planHandler.update(id, planToDexie({ ...parsedData, id } as Plan))
    return { ...parsedData, id }
  }

  const response = await fetch(`/api/plan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update plan')
  }

  await planHandler.update(id, planToDexie(parsedData as Plan))
  return parsedData
}

export const PlanService = {
  create,
  get,
  getByUserId,
  getAll,
  update,
}
