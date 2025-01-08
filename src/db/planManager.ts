import { prisma } from '@/lib/prisma'
import { prismaHandler } from '../lib/prismaHandler'
import { Plan } from '@prisma/client'

export const planManager = {
  getAllPlans: async (userId: string) => {
    return prismaHandler(() => prisma.plan.findMany({
      where: { userId },
      include: {
        weeks: true,
        goals: true,
      },
    }))
  },
  getCurrentPlan: async (userId: string) => {
    return prismaHandler(() => prisma.plan.findFirst({
      where: { userId, completed: false },
      include: {
        weeks: {
          include: {
            goals: {
              include: {
                strategies: true,
                indicators: true,
              },
            },
          },
        },
      },
    }))
  },
  getPlanById: async (id: string) => {
    return prismaHandler(() => prisma.plan.findUnique({
      where: { id },
      include: {
        weeks: {
          include: {
            goals: {
              include: {
                strategies: true,
                indicators: true,
              },
            },
          },
        },
      },
    }))
  },
  createPlan: (data: Plan) => {
    return prismaHandler(() => prisma.plan.create({ data }))
  },
  updatePlan: async (id: string, updates: Partial<Plan>) => {
    return prismaHandler(() => prisma.plan.update({
      where: { id },
      data: updates,
    }))
  },
  deletePlan: async (id: string) => {
    return prismaHandler(() => prisma.plan.delete({
      where: { id },
    }))
  },
}
