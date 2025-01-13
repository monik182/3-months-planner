import { prisma } from '@/lib/prisma'
import { prismaHandler } from '@/lib/prismaHandler'
import { Prisma, goal_history, goals, indicator_history, indicators, notifications, plans, strategies, strategy_history } from '@prisma/client'

export const plansHandler = {
  create: async (data: plans) => prismaHandler(() => prisma.plans.create({ data })),
  findMany: async (where?: Prisma.plansWhereInput) => prismaHandler(() => prisma.plans.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.plans.findUnique({ where: { id } })),
  findCurrent: async (user_id: string) => prismaHandler(() => prisma.plans.findFirst({ where: { user_id, completed: false } })),
  update: async (id: string, data: Partial<plans>) => prismaHandler(() => prisma.plans.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.plans.delete({ where: { id } })),
}

export const goalsHandler = {
  create: async (data: goals) => prismaHandler(() => prisma.goals.create({ data })),
  createMany: async (data: goals[]) => prismaHandler(() => prisma.goals.createMany({ data })),
  findMany: async (where?: Prisma.goalsWhereInput) => prismaHandler(() => prisma.goals.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.goals.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<goals>) => prismaHandler(() => prisma.goals.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.goals.delete({ where: { id } })),
}

export const goalHistoryHandler = {
  create: async (data: goal_history) => prismaHandler(() => prisma.goal_history.create({ data })),
  createMany: async (data: goal_history[]) => prismaHandler(() => prisma.goal_history.createMany({ data })),
  findMany: async (where?: Prisma.goal_historyWhereInput) => prismaHandler(() => prisma.goal_history.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.goal_history.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<goal_history>) => prismaHandler(() => prisma.goal_history.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.goal_history.delete({ where: { id } })),
}

export const strategiesHandler = {
  create: async (data: strategies) => prismaHandler(() => prisma.strategies.create({ data })),
  createMany: async (data: strategies[]) => prismaHandler(() => prisma.strategies.createMany({ data })),
  findMany: async (where?: Prisma.strategiesWhereInput) => prismaHandler(() => prisma.strategies.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.strategies.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<strategies>) => prismaHandler(() => prisma.strategies.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.strategies.delete({ where: { id } })),
}

export const strategyHistoryHandler = {
  create: async (data: strategy_history) => prismaHandler(() => prisma.strategy_history.create({ data })),
  createMany: async (data: strategy_history[]) => prismaHandler(() => prisma.strategy_history.createMany({ data })),
  findMany: async (where?: Prisma.strategy_historyWhereInput) => prismaHandler(() => prisma.strategy_history.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.strategy_history.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<strategy_history>) => prismaHandler(() => prisma.strategy_history.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.strategy_history.delete({ where: { id } })),
}

export const indicatorsHandler = {
  create: async (data: indicators) => prismaHandler(() => prisma.indicators.create({ data })),
  createMany: async (data: indicators[]) => prismaHandler(() => prisma.indicators.createMany({ data })),
  findMany: async (where?: Prisma.indicatorsWhereInput) => prismaHandler(() => prisma.indicators.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.indicators.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<indicators>) => prismaHandler(() => prisma.indicators.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.indicators.delete({ where: { id } })),
}

export const indicatorHistoryHandler = {
  create: async (data: indicator_history) => prismaHandler(() => prisma.indicator_history.create({ data })),
  createMany: async (data: indicator_history[]) => prismaHandler(() => prisma.indicator_history.createMany({ data })),
  findMany: async (where?: Prisma.indicator_historyWhereInput) => prismaHandler(() => prisma.indicator_history.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.indicator_history.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<indicator_history>) => prismaHandler(() => prisma.indicator_history.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.indicator_history.delete({ where: { id } })),
}

export const notificationsHandler = {
  create: async (data: notifications) => prismaHandler(() => prisma.notifications.create({ data })),
  findMany: async (where?: Prisma.notificationsWhereInput) => prismaHandler(() => prisma.notifications.findMany({ where })),
  findOne: async (id: string) => prismaHandler(() => prisma.notifications.findUnique({ where: { id } })),
  update: async (id: string, data: Partial<notifications>) => prismaHandler(() => prisma.notifications.update({ where: { id }, data })),
  delete: async (id: string) => prismaHandler(() => prisma.notifications.delete({ where: { id } })),
}
