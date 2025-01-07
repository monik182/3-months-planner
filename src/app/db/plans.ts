import { supabase } from '@/lib/supabaseClient'

const TABLE = 'plans'

export async function getPlanById(id: string) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
  if (error) throw new Error(`Failed to fetch plan: ${error.message}`)
  return data
}

export async function getAllPlans() {
  const { data, error } = await supabase.from(TABLE).select('*')
  if (error) throw new Error(`Failed to fetch plans: ${error.message}`)
  return data
}

export async function createPlan(planData: {
  vision: string
  three_year_milestone?: string | null
  start_date: string
  end_date: string
}) {
  const { data, error } = await supabase.from(TABLE).insert(planData).select().single()
  if (error) throw new Error(`Failed to create plan: ${error.message}`)
  return data
}

export async function updatePlan(
  id: string,
  updates: Partial<{ vision: string; three_year_milestone: string; plan_start_date: string; plan_end_date: string }>
) {
  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single()
  if (error) throw new Error(`Failed to update plan: ${error.message}`)
  return data
}

export async function deletePlan(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw new Error(`Failed to delete plan: ${error.message}`)
  return { success: true }
}
