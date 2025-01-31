const WEEKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export const DEFAULT_WEEKS = WEEKS.map((n) => n.toString())

export const DEFAULT_WEEKS_LIST = WEEKS.map((n) => ({ id: n.toString(), label: `Week ${n}`, value: n.toString() }))

export const DEFAULT_FREQUENCY = 7

export const DEFAULT_FREQUENCY_LIST = [...Array(DEFAULT_FREQUENCY).keys()]
  .map((n) => n + 1)
  .map((n) => {
    let label = `${n} days a week`
    if (n === 7) label = 'Daily'
    if (n === 1) label = 'Once a week'
    if (n === 2) label = 'Twice a week'
    return {
      id: n.toString(),
      label,
      value: n.toString()
    }
  })

export const TABLES = {
  PLANS: 'plans',
  GOALS: 'goals',
  STRATEGIES: 'strategies',
  WEEKS: 'weeks',
  INDICATORS: 'indicators',
}
