import { calculatePlanEndDate, getDate, getPlanStartDate } from '@/app/util'
import { plans } from '@prisma/client'
import cuid from 'cuid'

export class Plan {
  private id = cuid()
  private userId: string
  private vision = ''
  private milestone = ''
  private completed = false
  private startDate = getPlanStartDate()
  private endDate = calculatePlanEndDate(this.startDate)
  private created = getDate()
  private lastUpdate = getDate()

  constructor(userId: string, id?: string, vision?: string, milestone?: string, completed?: boolean, startDate?: string, endDate?: string, created?: string, lastUpdate?: string) {
    this.userId = userId

    if (id) this.id = id
    if (vision) this.vision = vision
    if (milestone) this.milestone = milestone
    if (completed) this.completed = completed
    if (startDate) this.startDate = startDate
    if (endDate) this.endDate = endDate
    if (created) this.created = created
    if (lastUpdate) this.lastUpdate = lastUpdate
  }

  createFromPrisma(plan: plans) {
    this.id = plan.id
    this.userId = plan.user_id
    this.vision = plan.vision
    this.milestone = plan.milestone
    this.completed = plan.completed
    this.startDate = getDate(plan.start_date)
    this.endDate = getDate(plan.end_date)
    this.created = getDate(plan.created)
    this.lastUpdate = getDate(plan.last_update)
    return this.get()
  }

  get() {
    return {
      id: this.id,
      userId: this.userId,
      vision: this.vision,
      completed: this.completed,
      startDate: this.startDate,
      endDate: this.endDate,
      created: this.created,
      lastUpdate: this.lastUpdate,
    }
  }

}
