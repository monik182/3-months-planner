import { createClient } from '@/app/util/supabase/server'
import {
  Plan,
  Goal,
  GoalHistory,
  Strategy,
  StrategyHistory,
  Indicator,
  IndicatorHistory,
  Notification,
  Waitlist,
  Feedback,
  User,
} from '@/app/types/models'

async function getClient() {
  return createClient()
}

function matchQuery<T>(query: any, where?: Partial<T>) {
  if (!where) return query
  Object.entries(where).forEach(([key, value]) => {
    if (value !== undefined) query = query.eq(key, value as any)
  })
  return query
}

export const planHandler = {
  create: async (data: Plan) => {
    const supabase = await getClient()
    const { data: result, error } = await supabase.from('plans').insert(data).select().single()
    if (error) throw error
    return result as Plan
  },
  findMany: async (where?: Partial<Plan>) => {
    const supabase = await getClient()
    let q = supabase.from('plans').select('*')
    q = matchQuery<Plan>(q, where)
    const { data, error } = await q
    if (error) throw error
    return data as Plan[]
  },
  findOne: async (id: string) => {
    const supabase = await getClient()
    const { data, error } = await supabase.from('plans').select('*').eq('id', id).single()
    if (error) return null
    return data as Plan
  },
  findInProgress: async (userId: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('plans').select('*').eq('user_id', userId).eq('completed', false).maybeSingle()
    return data as Plan | null
  },
  findStarted: async (userId: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('plans').select('*').eq('user_id', userId).eq('completed', false).eq('started', true).maybeSingle()
    return data as Plan | null
  },
  update: async (id: string, data: Partial<Plan>) => {
    const supabase = await getClient()
    const { data: result, error } = await supabase.from('plans').update(data).eq('id', id).select().single()
    if (error) throw error
    return result as Plan
  },
  delete: async (id: string) => {
    const supabase = await getClient()
    await supabase.from('plans').delete().eq('id', id)
  },
}

export const goalHandler = {
  create: async (data: Goal) => {
    const supabase = await getClient()
    const { error } = await supabase.from('goals').insert(data)
    if (error) throw error
    return data
  },
  createMany: async (data: Goal[]) => {
    const supabase = await getClient()
    const { error } = await supabase.from('goals').insert(data)
    if (error) throw error
    return data
  },
  findMany: async (where?: Partial<Goal>) => {
    const supabase = await getClient()
    let q = supabase.from('goals').select('*')
    q = matchQuery<Goal>(q, where)
    const { data, error } = await q
    if (error) throw error
    return data as Goal[]
  },
  findOne: async (id: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('goals').select('*').eq('id', id).maybeSingle()
    return data as Goal | null
  },
  update: async (id: string, data: Partial<Goal>) => {
    const supabase = await getClient()
    const { error } = await supabase.from('goals').update(data).eq('id', id)
    if (error) throw error
    return data
  },
  delete: async (id: string) => {
    const supabase = await getClient()
    await supabase.from('goals').delete().eq('id', id)
  },
  deleteMany: async (ids: string[]) => {
    const supabase = await getClient()
    await supabase.from('goals').delete().in('id', ids)
  },
}

export const goalHistoryHandler = {
  create: async (data: GoalHistory) => {
    const supabase = await getClient()
    const { error } = await supabase.from('goal_history').insert(data)
    if (error) throw error
    return data
  },
  createMany: async (data: GoalHistory[]) => {
    const supabase = await getClient()
    const { error } = await supabase.from('goal_history').insert(data)
    if (error) throw error
    return data
  },
  findMany: async (where: Partial<GoalHistory> = {}) => {
    const supabase = await getClient()
    let q = supabase.from('goal_history').select('*, goal(content)')
    q = matchQuery<GoalHistory>(q, where)
    const { data, error } = await q
    if (error) throw error
    return data as any
  },
  findOne: async (id: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('goal_history').select('*').eq('id', id).maybeSingle()
    return data as GoalHistory | null
  },
  update: async (id: string, data: Partial<GoalHistory>) => {
    const supabase = await getClient()
    const { error } = await supabase.from('goal_history').update(data).eq('id', id)
    if (error) throw error
    return data
  },
  delete: async (id: string) => {
    const supabase = await getClient()
    await supabase.from('goal_history').delete().eq('id', id)
  },
}

// Additional handlers for strategies and indicators would follow the same pattern
