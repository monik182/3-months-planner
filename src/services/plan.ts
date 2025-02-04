import { DixiePlan } from '@/app/types/types'
import { planHandler } from '@/db/dexieHandler'
import { PartialPlanSchema, PlanSchema } from '@/lib/validators/plan'
import { Plan, Prisma } from '@prisma/client'

const ENABLE_CLOUD_SYNC = process.env.ENABLE_CLOUD_SYNC

const getByUserId = async (userId: string): Promise<Plan | null> => {
  const planLocal = await planHandler.findInProgress(userId)

  if (planLocal) {
    return dixieToPlan(planLocal)
  }

  if (!ENABLE_CLOUD_SYNC) {
    return null
  }

  const response = await fetch(`/api/plan?userId=${userId}`, {
    method: 'GET',
  })
  const plan = await response.json()
  return plan
}

const create = async (data: Prisma.PlanCreateInput): Promise<Plan> => {
  if (!ENABLE_CLOUD_SYNC) {
    const plan = PlanSchema.parse(data)
    await planHandler.create(planToDixie(plan))
    return plan
  }

  const body = JSON.stringify(data)

  return fetch(`/api/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
    .then(response => response.json())
    .then(async (plan) => {
      await planHandler.create(planToDixie(plan))
      return plan
    })
}

const get = async (id: string): Promise<Plan | null> => {
  const plan = await planHandler.findOne(id)
  if (plan) {
    return dixieToPlan(plan)
  }

  if (!ENABLE_CLOUD_SYNC) {
    return null
  }

  return fetch(`/api/plan/${id}`).then(response => response.json())
}

const getAll = async (userId: string): Promise<Plan[]> => {
  const plans = await planHandler.findMany({ userId })
  if (plans?.length > 0) {
    return plans.map(dixieToPlan)
  }

  if (!ENABLE_CLOUD_SYNC) {
    return []
  }

  const response = await fetch(`/api/plan/all?userId=${userId}`, {
    method: 'GET',
  })
  const plan = await response.json()
  return plan
}

const update = async (id: string, plan: Prisma.PlanUpdateInput): Promise<Partial<Plan>> => {
  if (!ENABLE_CLOUD_SYNC) {
    await planHandler.update(id, planToDixie(plan as Plan))
    return PartialPlanSchema.parse(plan)
  }

  return fetch(`/api/plan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan),
  }).then(response => response.json())
    .then(async () => {
      await planHandler.update(id, planToDixie(plan as Plan))
      return PartialPlanSchema.parse(plan)
    })
}

export const PlanService = {
  create,
  get,
  getByUserId,
  getAll,
  update,
}


function dixieToPlan(plan: DixiePlan): Plan {
  return {
    ...plan,
    completed: Boolean(plan.completed),
    started: Boolean(plan.started)
  }
}


function planToDixie(plan: Plan): DixiePlan {
  return {
    ...plan,
    completed: Number(plan.completed),
    started: Number(plan.started)
  }
}
