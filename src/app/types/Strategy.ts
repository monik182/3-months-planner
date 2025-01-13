import { Status } from '@/app/types'
import { strategies } from '@prisma/client'
import cuid from 'cuid'

export class Strategy {
  private id = cuid()
  private goalId: string
  private content = ''
  private weeks: string[] = []
  private status = Status.ACTIVE

  constructor(goalId: string, id?: string, content?: string, weeks?: string[], status?: Status) {
    this.goalId = goalId

    if (id) this.id = id
    if (content) this.content = content
    if (weeks) this.weeks = weeks
    if (status) this.status = status
  }

  createFromPrisma(strategy: strategies) {
    this.id = strategy.id
    this.goalId = strategy.goal_id
    this.weeks = strategy.weeks.split(',')
    this.content = strategy.content
    this.status = strategy.status as Status
    return this.get()
  }

  get() {
    return {
      id: this.id,
      goalId: this.goalId,
      content: this.content,
      weeks: this.weeks,
      status: this.status,
    }
  }

}
