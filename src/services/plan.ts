import { Goal, GoalHistory, Indicator, IndicatorHistory, Plan, Strategy, StrategyHistory } from '@/app/types'

const getByUserId = async (userId: string) => {
  const response = await fetch(`/api/plan?userId=${userId}`, {
    method: 'GET',
  })
  const plan = await response.json()
  return plan
}

interface PlanData {
  plan: Plan
  goals: Goal[]
  strategies: Strategy[]
  indicators: Indicator[]
  goalHistory: GoalHistory[]
  strategyHistory: StrategyHistory[]
  indicatorHistory: IndicatorHistory[]
}

const createPlan = async (plan: Plan) => {
  return fetch(`/api/plan`, {
    method: 'POST',
    body: JSON.stringify(plan)
  }).then(response => response.json())
}

const createGoal = (goal: Goal) => {
  return fetch(`/api/goal`, { // TODO: create this!!!!
    method: 'POST',
    body: JSON.stringify(goal)
  }).then(response => response.json())
}

const createStrategy = (strategy: Strategy) => {
  return fetch(`/api/strategy`, { // TODO: create this!!!!
    method: 'POST',
    body: JSON.stringify(strategy)
  }).then(response => response.json())
}

const createIndicator = (indicator: Indicator) => {
  return fetch(`/api/indicator`, { // TODO: create this!!!!
    method: 'POST',
    body: JSON.stringify(indicator)
  }).then(response => response.json())
}

const create = async (data: PlanData) => {
  const plan = await createPlan(data.plan)
  const goals = await Promise.allSettled(data.goals.map(createGoal))
  const strategies = await Promise.allSettled(data.strategies.map(createStrategy))
  const indicators = await Promise.allSettled(data.indicators.map(createIndicator))
}

export const PlanService = {
  getByUserId,
  create,
}
