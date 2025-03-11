import { planHandler } from '@/db/dexieHandler'
import { PartialPlanSchema, PlanSchema } from '@/lib/validators/plan'
import { Plan, Prisma } from '@prisma/client'
import { SyncService } from '@/services/sync'
import { dexieToPlan, planToDexie } from '@/app/util'
import { QueueEntityType, QueueOperation } from '@/app/types/types'

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
  const plan = await response.json()
  return plan
}

const create = async (data: Prisma.PlanCreateInput): Promise<Plan> => {
  const parsedData = PlanSchema.parse(data)
  await planHandler.create(planToDexie(parsedData))
  await SyncService.queueForSync(QueueEntityType.PLAN, parsedData.id, QueueOperation.CREATE, parsedData)
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

  return fetch(`/api/plan/${id}`).then(response => response.json())
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
  const plan = await response.json()
  return plan
}

const update = async (id: string, plan: Prisma.PlanUpdateInput): Promise<Partial<Plan>> => {
  const parsedData = PartialPlanSchema.parse(plan)
  const planLocal = await planHandler.findOne(id)
  await planHandler.update(id, planToDexie({ ...planLocal, ...parsedData } as Plan))
  await SyncService.queueForSync(QueueEntityType.PLAN, id, QueueOperation.UPDATE, { ...parsedData, id })
  return { ...parsedData, id }
}

export const PlanService = {
  create,
  get,
  getByUserId,
  getAll,
  update,
}
