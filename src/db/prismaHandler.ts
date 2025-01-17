import { prisma } from '@/lib/prisma'
import { prismaHandler } from '@/lib/prismaHandler'
import { Prisma } from '@prisma/client'

export const planHandler = {
  create: async (data: Prisma.PlanCreateInput) => prismaHandler(() => prisma.plan.create({ data })),
  findMany: async (where?: Prisma.PlanWhereInput) => prismaHandler(() => prisma.plan.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.plan.findUnique({ where: { id } })),
  findCurrent: async (userId: string) => prismaHandler(() => prisma.plan.findFirst({ where: { userId, completed: false } })),
  update: async (id: string, data: Prisma.PlanUpdateInput) => prismaHandler(() => prisma.plan.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.plan.delete({ where: { id } })),
}

export const goalHandler = {
  create: async (data: Prisma.GoalCreateInput) => prismaHandler(() => prisma.goal.create({ data })),
  createMany: async (data: Prisma.GoalCreateManyInput) => prismaHandler(() => prisma.goal.createMany({ data })),
  findMany: async (where?: Prisma.GoalWhereInput) => prismaHandler(() => prisma.goal.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.goal.findUnique({ where: { id } })),
  update: async (id: string, data: Prisma.GoalUpdateInput) => prismaHandler(() => prisma.goal.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.goal.delete({ where: { id } })),
}

export const goalHistoryHandler = {
  create: async (data: Prisma.GoalHistoryCreateInput) => prismaHandler(() => prisma.goalHistory.create({ data })),
  createMany: async (data: Prisma.GoalHistoryCreateManyInput) => prismaHandler(() => prisma.goalHistory.createMany({ data })),
  findMany: async (where?: Prisma.GoalHistoryWhereInput) => prismaHandler(() => prisma.goalHistory.findMany({
    where, include: {
      goal: {
        select: {
          content: true,
        }
      }
    }
  })),
  findOne: async (id: string) => prismaHandler(() => prisma.goalHistory.findUnique({ where: { id } })),
  update: async (id: string, data: Prisma.GoalHistoryUpdateInput) => prismaHandler(() => prisma.goalHistory.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.goalHistory.delete({ where: { id } })),
}

export const strategyHandler = {
  create: async (data: Prisma.StrategyCreateInput) => prismaHandler(() => prisma.strategy.create({ data })),
  createMany: async (data: Prisma.StrategyCreateManyInput) => prismaHandler(() => prisma.strategy.createMany({ data })),
  findMany: async (where?: Prisma.StrategyWhereInput) => prismaHandler(() => prisma.strategy.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.strategy.findUnique({ where: { id } })),
  update: async (id: string, data: Prisma.StrategyUpdateInput) => prismaHandler(() => prisma.strategy.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.strategy.delete({ where: { id } })),
}

export const strategyHistoryHandler = {
  create: async (data: Prisma.StrategyHistoryCreateInput) => prismaHandler(() => prisma.strategyHistory.create({ data })),
  createMany: async (data: Prisma.StrategyHistoryCreateManyInput) => prismaHandler(() => prisma.strategyHistory.createMany({ data })),
  findMany: async (where?: Prisma.StrategyHistoryWhereInput, seq?: string) => prismaHandler(() => prisma.strategyHistory.findMany({
    where: {
      ...where,
      strategy: {
        ...(seq && { weeks: { has: seq } })
      },
    }, include: {
      strategy: {
        select: {
          content: true,
          weeks: true,
        }
      }
    }
  })),
  findManyByGoalId: async (goalId: string, where?: Prisma.StrategyHistoryWhereInput, seq?: string) => prismaHandler(() => prisma.strategyHistory.findMany({
    where: {
      ...where,
      strategy: {
        goalId,
        ...(seq && { weeks: { has: seq } })
      },
    }, include: {
      strategy: {
        select: {
          content: true,
          weeks: true,
        }
      }
    }
  })),
  findOne: async (id: string) => prismaHandler(() => prisma.strategyHistory.findUnique({ where: { id } })),
  update: async (id: string, data: Prisma.StrategyHistoryUpdateInput) => prismaHandler(() => prisma.strategyHistory.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.strategyHistory.delete({ where: { id } })),
}

export const indicatorHandler = {
  create: async (data: Prisma.IndicatorCreateInput) => prismaHandler(() => prisma.indicator.create({ data })),
  createMany: async (data: Prisma.IndicatorCreateManyInput) => prismaHandler(() => prisma.indicator.createMany({ data })),
  findMany: async (where?: Prisma.IndicatorWhereInput) => prismaHandler(() => prisma.indicator.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.indicator.findUnique({ where: { id } })),
  update: async (id: string, data: Prisma.IndicatorUpdateInput) => prismaHandler(() => prisma.indicator.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.indicator.delete({ where: { id } })),
}

export const indicatorHistoryHandler = {
  create: async (data: Prisma.IndicatorHistoryCreateInput) => prismaHandler(() => prisma.indicatorHistory.create({ data })),
  createMany: async (data: Prisma.IndicatorHistoryCreateManyInput) => prismaHandler(() => prisma.indicatorHistory.createMany({ data })),
  findMany: async (where?: Prisma.IndicatorHistoryWhereInput) => prismaHandler(() => prisma.indicatorHistory.findMany({
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
  })),
  findManyByGoalId: async (goalId: string, where?: Prisma.IndicatorHistoryWhereInput) => prismaHandler(() => prisma.indicatorHistory.findMany({
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
  })),
  findOne: async (id: string) => prismaHandler(() => prisma.indicatorHistory.findUnique({ where: { id } })),
  update: async (id: string, data: Prisma.IndicatorHistoryUpdateInput) => prismaHandler(() => prisma.indicatorHistory.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.indicatorHistory.delete({ where: { id } })),
}

export const notificationHandler = {
  create: async (data: Prisma.NotificationCreateInput) => prismaHandler(() => prisma.notification.create({ data })),
  findMany: async (where?: Prisma.NotificationWhereInput) => prismaHandler(() => prisma.notification.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.notification.findUnique({ where: { id } })),
  update: async (id: string, data: Prisma.NotificationUpdateInput) => prismaHandler(() => prisma.notification.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.notification.delete({ where: { id } })),
}
