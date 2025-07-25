import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const planHandler = {
  create: async (data: Prisma.PlanCreateInput) => prisma.plan.create({ data }),
  findMany: async (where?: Prisma.PlanWhereInput) => prisma.plan.findMany({ where }),
  findOne: async (id: string) => prisma.plan.findUnique({ where: { id } }),
  findInProgress: async (userId: string) => prisma.plan.findFirst({ where: { userId, completed: false } }),
  findStarted: async (userId: string) => prisma.plan.findFirst({ where: { userId, completed: false, started: true } }),
  update: async (id: string, data: Prisma.PlanUpdateInput) => prisma.plan.update({ where: { id }, data }),
  delete: async (id: string) => prisma.plan.delete({ where: { id } }),
}

export const goalHandler = {
  create: async (data: Prisma.GoalCreateInput) => prisma.goal.create({ data }),
  createMany: async (data: Prisma.GoalCreateManyInput[]) => prisma.goal.createMany({ data }),
  findMany: async (where?: Prisma.GoalWhereInput, select?: Prisma.GoalSelect) =>
    prisma.goal.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      ...(select ? { select } : {}),
    }),
  findOne: async (id: string) => prisma.goal.findUnique({ where: { id } }),
  update: async (id: string, data: Prisma.GoalUpdateInput) => prisma.goal.update({ where: { id }, data }),
  delete: async (id: string) => prisma.goal.delete({ where: { id } }),
  deleteMany: async (id: string[]) => prisma.goal.deleteMany({ where: { id: { in: id } } }),
  upsert: async (data: Prisma.GoalCreateInput) => prisma.goal.upsert({ where: { id: data.id }, update: data, create: data }),
}

export const goalHistoryHandler = {
  create: async (data: Prisma.GoalHistoryCreateInput) => prisma.goalHistory.create({ data }),
  createMany: async (data: Prisma.GoalHistoryCreateManyInput[]) => prisma.goalHistory.createMany({ data, skipDuplicates: true }),
  findMany: async (where: Prisma.GoalHistoryWhereInput = {}, status?: string) => prisma.goalHistory.findMany({
    where: {
      ...where,
      goal: {
        status,
      }
    }, include: {
      goal: {
        select: {
          content: true,
        }
      }
    },
    orderBy: { createdAt: 'asc' },
  }),
  findOne: async (id: string) => prisma.goalHistory.findUnique({ where: { id } }),
  update: async (id: string, data: Prisma.GoalHistoryUpdateInput) => prisma.goalHistory.update({ where: { id }, data }),
  delete: async (id: string) => prisma.goalHistory.delete({ where: { id } }),
}

export const strategyHandler = {
  create: async (data: Prisma.StrategyCreateInput) => prisma.strategy.create({ data }),
  createMany: async (data: Prisma.StrategyCreateManyInput[]) => prisma.strategy.createMany({ data }),
  findMany: async (
    where?: Prisma.StrategyWhereInput,
    select?: Prisma.StrategySelect,
  ) =>
    prisma.strategy.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      ...(select ? { select } : {}),
    }),
  findOne: async (id: string) => prisma.strategy.findUnique({ where: { id } }),
  update: async (id: string, data: Prisma.StrategyUpdateInput) => prisma.strategy.update({ where: { id }, data }),
  delete: async (id: string) => prisma.strategy.delete({ where: { id } }),
  deleteMany: async (id: string[]) => prisma.strategy.deleteMany({ where: { id: { in: id } } }),
}

export const strategyHistoryHandler = {
  create: async (data: Prisma.StrategyHistoryCreateInput) => prisma.strategyHistory.create({ data }),
  createMany: async (data: Prisma.StrategyHistoryCreateManyInput[]) => prisma.strategyHistory.createMany({ data, skipDuplicates: true }),
  findMany: async (where: Prisma.StrategyHistoryWhereInput = {}, seq?: string, status?: string) => prisma.strategyHistory.findMany({
    where: {
      ...where,
      strategy: {
        status,
        ...(seq && { weeks: { has: seq } })
      },
    }, include: {
      strategy: {
        select: {
          content: true,
          weeks: true,
          goalId: true,
          frequency: true,
        }
      }
    },
    orderBy: { createdAt: 'asc' },
  }),
  findManyByGoalId: async (goalId: string, where: Prisma.StrategyHistoryWhereInput = {}, seq?: string, status?: string) => prisma.strategyHistory.findMany({
    where: {
      ...where,
      strategy: {
        goalId,
        status,
        ...(seq && { weeks: { has: seq } })
      },
    }, include: {
      strategy: {
        select: {
          content: true,
          weeks: true,
          frequency: true,
        }
      }
    }
  }),
  findOne: async (id: string) => prisma.strategyHistory.findUnique({ where: { id } }),
  update: async (id: string, data: Prisma.StrategyHistoryUpdateInput) => prisma.strategyHistory.update({ where: { id }, data }),
  delete: async (id: string) => prisma.strategyHistory.delete({ where: { id } }),
}

export const indicatorHandler = {
  create: async (data: Prisma.IndicatorCreateInput) => prisma.indicator.create({ data }),
  createMany: async (data: Prisma.IndicatorCreateManyInput[]) => prisma.indicator.createMany({ data }),
  findMany: async (where?: Prisma.IndicatorWhereInput, select?: Prisma.IndicatorSelect) => prisma.indicator.findMany({ where, ...(select ? { select } : {}), }),
  findOne: async (id: string) => prisma.indicator.findUnique({ where: { id } }),
  update: async (id: string, data: Prisma.IndicatorUpdateInput) => prisma.indicator.update({ where: { id }, data }),
  delete: async (id: string) => prisma.indicator.delete({ where: { id } }),
  deleteMany: async (id: string[]) => prisma.indicator.deleteMany({ where: { id: { in: id } } }),
}

export const indicatorHistoryHandler = {
  create: async (data: Prisma.IndicatorHistoryCreateInput) => prisma.indicatorHistory.create({ data }),
  createMany: async (data: Prisma.IndicatorHistoryCreateManyInput[]) => prisma.indicatorHistory.createMany({ data, skipDuplicates: true }),
  findMany: async (where?: Prisma.IndicatorHistoryWhereInput) => prisma.indicatorHistory.findMany({
    where, include: {
      indicator: {
        select: {
          content: true,
          initialValue: true,
          goalValue: true,
          metric: true,
        }
      }
    }
  }),
  findManyByGoalId: async (goalId: string, where: Prisma.IndicatorHistoryWhereInput = {}) => prisma.indicatorHistory.findMany({
    where: {
      ...where,
      indicator: {
        goalId,
      },
    }, include: {
      indicator: {
        select: {
          content: true,
          initialValue: true,
          goalValue: true,
          metric: true,
        }
      }
    }
  }),
  findOne: async (id: string) => prisma.indicatorHistory.findUnique({ where: { id } }),
  update: async (id: string, data: Prisma.IndicatorHistoryUpdateInput) => prisma.indicatorHistory.update({ where: { id }, data }),
  delete: async (id: string) => prisma.indicatorHistory.delete({ where: { id } }),
}

export const notificationHandler = {
  create: async (data: Prisma.NotificationCreateInput) => prisma.notification.create({ data }),
  findMany: async (where?: Prisma.NotificationWhereInput) => prisma.notification.findMany({ where }),
  findOne: async (id: string) => prisma.notification.findUnique({ where: { id } }),
  update: async (id: string, data: Prisma.NotificationUpdateInput) => prisma.notification.update({ where: { id }, data }),
  delete: async (id: string) => prisma.notification.delete({ where: { id } }),
}

export const waitlistHandler = {
  create: async (data: Prisma.WaitlistCreateInput) => prisma.waitlist.create({ data }),
  createMany: async (data: Prisma.WaitlistCreateManyInput[]) => prisma.waitlist.createMany({ data }),
  findMany: async (where?: Prisma.WaitlistWhereInput, select?: Prisma.WaitlistSelect) => prisma.waitlist.findMany({ where, ...(select ? { select } : {}) }),
  findOne: async (email: string) => prisma.waitlist.findUnique({ where: { email } }),
  findOneByToken: async (inviteToken: string) => prisma.waitlist.findUnique({ where: { inviteToken } }),
  update: async (id: string, data: Prisma.WaitlistUpdateInput) => prisma.waitlist.update({ where: { id }, data }),
  delete: async (id: string) => prisma.waitlist.delete({ where: { id } }),
}

export const feedbackHandler = {
  create: async (data: Prisma.FeedbackCreateInput) => prisma.feedback.create({ data }),
  createMany: async (data: Prisma.FeedbackCreateManyInput[]) => prisma.feedback.createMany({ data }),
  findMany: async (where?: Prisma.FeedbackWhereInput, select?: Prisma.FeedbackSelect) => prisma.feedback.findMany({ where, ...(select ? { select } : {}) }),
  findOne: async (id: string) => prisma.feedback.findUnique({ where: { id } }),
  update: async (id: string, data: Prisma.FeedbackUpdateInput) => prisma.feedback.update({ where: { id }, data }),
  delete: async (id: string) => prisma.feedback.delete({ where: { id } }),
}

export const userHandler = {
  create: async (data: Prisma.UserCreateInput) => prisma.user.create({ data }),
  createMany: async (data: Prisma.UserCreateManyInput[]) => prisma.user.createMany({ data }),
  findMany: async (where?: Prisma.UserWhereInput, select?: Prisma.UserSelect) => prisma.user.findMany({ where, ...(select ? { select } : {}) }),
  findOne: async (id: string) => prisma.user.findUnique({ where: { id } }),
  findOneByEmail: async (email: string) => prisma.user.findUnique({ where: { email } }),
  update: async (id: string, data: Prisma.UserUpdateInput) => prisma.user.update({ where: { id }, data }),
  delete: async (id: string) => prisma.user.delete({ where: { id } }),
  upsert: async (data: Prisma.UserCreateInput) => prisma.user.upsert({ where: { id: data.users?.connect?.id }, update: data, create: data }),
}
