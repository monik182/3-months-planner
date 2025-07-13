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

export const strategyHandler = {
  create: async (data: Strategy) => {
    const supabase = await getClient()
    const { error } = await supabase.from('strategies').insert(data)
    if (error) throw error
    return data
  },
  createMany: async (data: Strategy[]) => {
    const supabase = await getClient()
    const { error } = await supabase.from('strategies').insert(data)
    if (error) throw error
    return data
  },
  findMany: async (where?: Partial<Strategy>) => {
    const supabase = await getClient()
    let q = supabase.from('strategies').select('*')
    q = matchQuery<Strategy>(q, where)
    const { data, error } = await q
    if (error) throw error
    return data as Strategy[]
  },
  findOne: async (id: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('strategies').select('*').eq('id', id).maybeSingle()
    return data as Strategy | null
  },
  update: async (id: string, data: Partial<Strategy>) => {
    const supabase = await getClient()
    const { error } = await supabase.from('strategies').update(data).eq('id', id)
    if (error) throw error
    return data
  },
  delete: async (id: string) => {
    const supabase = await getClient()
    await supabase.from('strategies').delete().eq('id', id)
  },
  deleteMany: async (ids: string[]) => {
    const supabase = await getClient()
    await supabase.from('strategies').delete().in('id', ids)
  },
}

export const strategyHistoryHandler = {
  create: async (data: StrategyHistory) => {
    const supabase = await getClient()
    const { error } = await supabase.from('strategy_history').insert(data)
    if (error) throw error
    return data
  },
  createMany: async (data: StrategyHistory[]) => {
    const supabase = await getClient()
    const { error } = await supabase.from('strategy_history').insert(data)
    if (error) throw error
    return data
  },
  findMany: async (where: Partial<StrategyHistory> = {}, seq?: string) => {
    const supabase = await getClient()
    let q = supabase
      .from('strategy_history')
      .select('*, strategy(content,weeks,goal_id,frequency)')
    q = matchQuery<StrategyHistory>(q, where)
    if (seq) q = q.contains('strategy.weeks', [seq])
    const { data, error } = await q
    if (error) throw error
    return data as any
  },
  findManyByGoalId: async (
    goalId: string,
    where: Partial<StrategyHistory> = {},
    seq?: string
  ) => {
    const supabase = await getClient()
    let q = supabase
      .from('strategy_history')
      .select('*, strategy(content,weeks,frequency,goal_id)')
      .eq('strategy.goal_id', goalId)
    q = matchQuery<StrategyHistory>(q, where)
    if (seq) q = q.contains('strategy.weeks', [seq])
    const { data, error } = await q
    if (error) throw error
    return data as any
  },
  findOne: async (id: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('strategy_history').select('*').eq('id', id).maybeSingle()
    return data as StrategyHistory | null
  },
  update: async (id: string, data: Partial<StrategyHistory>) => {
    const supabase = await getClient()
    const { error } = await supabase.from('strategy_history').update(data).eq('id', id)
    if (error) throw error
    return data
  },
  delete: async (id: string) => {
    const supabase = await getClient()
    await supabase.from('strategy_history').delete().eq('id', id)
  },
  deleteMany: async (where: Partial<StrategyHistory>) => {
    const supabase = await getClient()
    await matchQuery<StrategyHistory>(supabase.from('strategy_history'), where).delete()
  },
}

export const indicatorHandler = {
  create: async (data: Indicator) => {
    const supabase = await getClient()
    const { error } = await supabase.from('indicators').insert(data)
    if (error) throw error
    return data
  },
  createMany: async (data: Indicator[]) => {
    const supabase = await getClient()
    const { error } = await supabase.from('indicators').insert(data)
    if (error) throw error
    return data
  },
  findMany: async (where?: Partial<Indicator>) => {
    const supabase = await getClient()
    let q = supabase.from('indicators').select('*')
    q = matchQuery<Indicator>(q, where)
    const { data, error } = await q
    if (error) throw error
    return data as Indicator[]
  },
  findOne: async (id: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('indicators').select('*').eq('id', id).maybeSingle()
    return data as Indicator | null
  },
  update: async (id: string, data: Partial<Indicator>) => {
    const supabase = await getClient()
    const { error } = await supabase.from('indicators').update(data).eq('id', id)
    if (error) throw error
    return data
  },
  delete: async (id: string) => {
    const supabase = await getClient()
    await supabase.from('indicators').delete().eq('id', id)
  },
  deleteMany: async (ids: string[]) => {
    const supabase = await getClient()
    await supabase.from('indicators').delete().in('id', ids)
  },
}

export const indicatorHistoryHandler = {
  create: async (data: IndicatorHistory) => {
    const supabase = await getClient()
    const { error } = await supabase.from('indicator_history').insert(data)
    if (error) throw error
    return data
  },
  createMany: async (data: IndicatorHistory[]) => {
    const supabase = await getClient()
    const { error } = await supabase.from('indicator_history').insert(data)
    if (error) throw error
    return data
  },
  findMany: async (where: Partial<IndicatorHistory> = {}) => {
    const supabase = await getClient()
    let q = supabase
      .from('indicator_history')
      .select('*, indicator(content,initial_value,goal_value,metric,goal_id)')
    q = matchQuery<IndicatorHistory>(q, where)
    const { data, error } = await q
    if (error) throw error
    return data as any
  },
  findManyByGoalId: async (
    goalId: string,
    where: Partial<IndicatorHistory> = {}
  ) => {
    const supabase = await getClient()
    let q = supabase
      .from('indicator_history')
      .select('*, indicator(content,initial_value,goal_value,metric,goal_id)')
      .eq('indicator.goal_id', goalId)
    q = matchQuery<IndicatorHistory>(q, where)
    const { data, error } = await q
    if (error) throw error
    return data as any
  },
  findOne: async (id: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('indicator_history').select('*').eq('id', id).maybeSingle()
    return data as IndicatorHistory | null
  },
  update: async (id: string, data: Partial<IndicatorHistory>) => {
    const supabase = await getClient()
    const { error } = await supabase.from('indicator_history').update(data).eq('id', id)
    if (error) throw error
    return data
  },
  delete: async (id: string) => {
    const supabase = await getClient()
    await supabase.from('indicator_history').delete().eq('id', id)
  },
  deleteMany: async (where: Partial<IndicatorHistory>) => {
    const supabase = await getClient()
    await matchQuery<IndicatorHistory>(supabase.from('indicator_history'), where).delete()
  },
}

export const notificationHandler = {
  create: async (data: Notification) => {
    const supabase = await getClient()
    const { error } = await supabase.from('notifications').insert(data)
    if (error) throw error
    return data
  },
  findMany: async (where?: Partial<Notification>) => {
    const supabase = await getClient()
    let q = supabase.from('notifications').select('*')
    q = matchQuery<Notification>(q, where)
    const { data, error } = await q
    if (error) throw error
    return data as Notification[]
  },
  findOne: async (id: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('notifications').select('*').eq('id', id).maybeSingle()
    return data as Notification | null
  },
  update: async (id: string, data: Partial<Notification>) => {
    const supabase = await getClient()
    const { error } = await supabase.from('notifications').update(data).eq('id', id)
    if (error) throw error
    return data
  },
  delete: async (id: string) => {
    const supabase = await getClient()
    await supabase.from('notifications').delete().eq('id', id)
  },
}

export const userHandler = {
  create: async (data: User) => {
    const supabase = await getClient()
    const { data: result, error } = await supabase.from('users').insert(data).select().single()
    if (error) throw error
    return result as User
  },
  findOne: async (id: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('users').select('*').eq('id', id).maybeSingle()
    return data as User | null
  },
  findOneByEmail: async (email: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('users').select('*').eq('email', email).maybeSingle()
    return data as User | null
  },
  findOneByAuth0Id: async (auth0Id: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('users').select('*').eq('auth0_id', auth0Id).maybeSingle()
    return data as User | null
  },
  update: async (id: string, data: Partial<User>) => {
    const supabase = await getClient()
    const { data: result, error } = await supabase.from('users').update(data).eq('id', id).select().single()
    if (error) throw error
    return result as User
  },
  delete: async (id: string) => {
    const supabase = await getClient()
    await supabase.from('users').delete().eq('id', id)
  },
  upsert: async (data: User) => {
    const supabase = await getClient()
    const { data: result, error } = await supabase.from('users').upsert(data).select().single()
    if (error) throw error
    return result as User
  },
}

export const waitlistHandler = {
  create: async (data: Waitlist) => {
    const supabase = await getClient()
    const { data: result, error } = await supabase.from('waitlist').insert(data).select().single()
    if (error) throw error
    return result as Waitlist
  },
  findOne: async (email: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('waitlist').select('*').eq('email', email).maybeSingle()
    return data as Waitlist | null
  },
  findOneByToken: async (token: string) => {
    const supabase = await getClient()
    const { data } = await supabase.from('waitlist').select('*').eq('invite_token', token).maybeSingle()
    return data as Waitlist | null
  },
  update: async (id: string, data: Partial<Waitlist>) => {
    const supabase = await getClient()
    const { data: result, error } = await supabase.from('waitlist').update(data).eq('id', id).select().single()
    if (error) throw error
    return result as Waitlist
  },
  delete: async (id: string) => {
    const supabase = await getClient()
    await supabase.from('waitlist').delete().eq('id', id)
  },
}
