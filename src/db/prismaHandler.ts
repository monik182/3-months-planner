import { prisma } from '@/lib/prisma'
import { prismaHandler } from '@/lib/prismaHandler'
import { Goal, GoalHistory, Indicator, IndicatorHistory, Plan, Prisma, Strategy, StrategyHistory, Notification } from '@prisma/client'

export const planHandler = {
  create: async (data: Plan) => prismaHandler(() => prisma.plan.create({ data })),
  findMany: async (where?: Prisma.PlanWhereInput) => prismaHandler(() => prisma.plan.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.plan.findUnique({ where: { id } })),
  findCurrent: async (userId: string) => prismaHandler(() => prisma.plan.findFirst({ where: { userId, completed: false } })),
  update: async (id: string, data: Partial<Plan>) => prismaHandler(() => prisma.plan.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.plan.delete({ where: { id } })),
}

export const goalHandler = {
  create: async (data: Goal) => prismaHandler(() => prisma.goal.create({ data })),
  createMany: async (data: Goal[]) => prismaHandler(() => prisma.goal.createMany({ data })),
  findMany: async (where?: Prisma.GoalWhereInput) => prismaHandler(() => prisma.goal.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.goal.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<Goal>) => prismaHandler(() => prisma.goal.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.goal.delete({ where: { id } })),
}

export const goalHistoryHandler = {
  create: async (data: GoalHistory) => prismaHandler(() => prisma.goalHistory.create({ data })),
  createMany: async (data: GoalHistory[]) => prismaHandler(() => prisma.goalHistory.createMany({ data })),
  findMany: async (where?: Prisma.GoalHistoryWhereInput) => prismaHandler(() => prisma.goalHistory.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.goalHistory.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<GoalHistory>) => prismaHandler(() => prisma.goalHistory.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.goalHistory.delete({ where: { id } })),
}

export const strategyHandler = {
  create: async (data: Strategy) => prismaHandler(() => prisma.strategy.create({ data })),
  createMany: async (data: Strategy[]) => prismaHandler(() => prisma.strategy.createMany({ data })),
  findMany: async (where?: Prisma.StrategyWhereInput) => prismaHandler(() => prisma.strategy.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.strategy.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<Strategy>) => prismaHandler(() => prisma.strategy.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.strategy.delete({ where: { id } })),
}

export const strategyHistoryHandler = {
  create: async (data: StrategyHistory) => prismaHandler(() => prisma.strategyHistory.create({ data })),
  createMany: async (data: StrategyHistory[]) => prismaHandler(() => prisma.strategyHistory.createMany({ data })),
  findMany: async (where?: Prisma.StrategyHistoryWhereInput) => prismaHandler(() => prisma.strategyHistory.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.strategyHistory.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<StrategyHistory>) => prismaHandler(() => prisma.strategyHistory.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.strategyHistory.delete({ where: { id } })),
}

export const indicatorHandler = {
  create: async (data: Indicator) => prismaHandler(() => prisma.indicator.create({ data })),
  createMany: async (data: Indicator[]) => prismaHandler(() => prisma.indicator.createMany({ data })),
  findMany: async (where?: Prisma.IndicatorWhereInput) => prismaHandler(() => prisma.indicator.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.indicator.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<Indicator>) => prismaHandler(() => prisma.indicator.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.indicator.delete({ where: { id } })),
}

export const indicatorHistoryHandler = {
  create: async (data: IndicatorHistory) => prismaHandler(() => prisma.indicatorHistory.create({ data })),
  createMany: async (data: IndicatorHistory[]) => prismaHandler(() => prisma.indicatorHistory.createMany({ data })),
  findMany: async (where?: Prisma.IndicatorHistoryWhereInput) => prismaHandler(() => prisma.indicatorHistory.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.indicatorHistory.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<IndicatorHistory>) => prismaHandler(() => prisma.indicatorHistory.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.indicatorHistory.delete({ where: { id } })),
}

export const notificationHandler = {
  create: async (data: Notification) => prismaHandler(() => prisma.notification.create({ data })),
  findMany: async (where?: Prisma.NotificationWhereInput) => prismaHandler(() => prisma.notification.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.notification.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<Notification>) => prismaHandler(() => prisma.notification.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.notification.delete({ where: { id } })),
}
