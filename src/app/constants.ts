const WEEKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export const DEFAULT_WEEKS = WEEKS.map((id) => id.toString())

export const DEFAULT_WEEKS_LIST = WEEKS.map((id) => ({ id: id.toString(), label: `Week ${id}`, value: id.toString() }))

export const TABLES = {
  PLANS: 'plans',
  GOALS: 'goals',
  STRATEGIES: 'strategies',
  WEEKS: 'weeks',
  INDICATORS: 'indicators',
}
