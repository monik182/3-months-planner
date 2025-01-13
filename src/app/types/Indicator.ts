import { Status } from '@/app/types'
import { indicators } from '@prisma/client'
import cuid from 'cuid'

export class Indicator {
  private id = cuid()
  private goalId: string
  private content = ''
  private metric = ''
  private startingValue = 0
  private goalValue = 0
  private status = Status.ACTIVE

  constructor(goalId: string, id?: string, content?: string, metric?: string, startingValue?: number, goalValue?: number, status?: Status) {
    this.goalId = goalId

    if (id) this.id = id
    if (content) this.content = content
    if (metric) this.metric = metric
    if (startingValue) this.startingValue = startingValue
    if (goalValue) this.goalValue = goalValue
    if (status) this.status = status
  }

  createFromPrisma(indicator: indicators) {
    this.id = indicator.id
    this.goalId = indicator.goal_id
    this.content = indicator.content
    this.metric = indicator.metric
    this.startingValue = indicator.starting_value
    this.goalValue = indicator.goal_value
    this.status = indicator.status as Status
    return this.get()
  }

  get() {
    return {
      id: this.id,
      goalId: this.goalId,
      content: this.content,
      metric: this.metric,
      startingValue: this.startingValue,
      goalValue: this.goalValue,
      status: this.status,
    }
  }

}
