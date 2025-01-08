const getPlanByUserId = async (userId: string) => {
  const response = await fetch(`/api/plan?userId=${userId}`, {
    method: 'GET',
  })
  const plan = await response.json()
  return plan
}

export const PlanService = {
  getPlanByUserId,
}
