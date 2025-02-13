import { DixiePlan } from '@/app/types/types'
import { planHandler } from '@/db/dexieHandler'
import { PartialPlanSchema, PlanSchema } from '@/lib/validators/plan'
import { Plan, Prisma } from '@prisma/client'

const ENABLE_CLOUD_SYNC = process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC

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
  const parsedData = PlanSchema.parse(data)
  await planHandler.create(planToDixie(parsedData))

  if (!ENABLE_CLOUD_SYNC) {
    return parsedData
  }

  const body = JSON.stringify({ ...data, id: parsedData.id })

  return fetch(`/api/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
    .then(response => response.json())
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
  await planHandler.update(id, planToDixie(plan as Plan))

  if (!ENABLE_CLOUD_SYNC) {
    return PartialPlanSchema.parse({ ...plan, id })
  }

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
    completed: Number(Boolean(plan.completed)),
    started: Number(Boolean(plan.started))
  }
}
