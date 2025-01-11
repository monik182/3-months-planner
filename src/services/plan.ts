import { Plan } from '../app/types'

const getByUserId = async (userId: string) => {
  const response = await fetch(`/api/plan?userId=${userId}`, {
    method: 'GET',
  })
  const plan = await response.json()
  return plan
}

// TODO: Refactor this to create plan and goals in seq
const create = async (data: Plan) => {
  const response = await fetch(`/api/plan`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  const plan = await response.json()
  return plan
}

export const PlanService = {
  getByUserId,
  create,
}
