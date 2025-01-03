import { Plan } from './types'
import { calculateEndDate, getNextStartDate } from './util'

export const WEEKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export const DEFAULT_WEEKS = WEEKS.map((id) => id.toString())

export const DEFAULT_STRATEGY = { id: '', value: '', weeks: [...DEFAULT_WEEKS], isEditing: false }

export const DEFAULT_WEEKS_LIST = WEEKS.map((id) => ({ id: id.toString(), label: `Week ${id}`, value: id.toString() }))

export const INITIAL_PLAN: Plan = {
  vision: '',
  threeYearMilestone: '',
  goals: [],
  startDate: getNextStartDate(),
  endDate: calculateEndDate(getNextStartDate()),
} 
