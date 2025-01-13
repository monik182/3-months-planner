import { Status } from '@/app/types'
import { goals } from '@prisma/client'
import cuid from 'cuid'

export class Goal {
  private id = cuid()
  private planId: string
  private content = ''
  private status = Status.ACTIVE

  constructor(planId: string, id?: string, content?: string, status?: Status) {
    this.planId = planId

    if (id) this.id = id
    if (content) this.content = content
    if (status) this.status = status
  }

  createFromPrisma(goal: goals) {
    this.id = goal.id
    this.planId = goal.plan_id
    this.content = goal.content
    this.status = goal.status as Status
    return this.get()
  }

  get() {
    return {
      id: this.id,
      planId: this.planId,
      content: this.content,
      status: this.status,
    }
  }

}
