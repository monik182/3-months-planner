import { goalHistoryHandler, indicatorHistoryHandler, strategyHistoryHandler } from '@/db/supabaseHandler'
import { createClient } from '@/app/util/supabase/server'

import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data || typeof data !== 'object') {
    return new Response(JSON.stringify({ message: 'Invalid or missing data', ok: false }), { status: 400 })
  }

  if (!data.goalHistory) {
    return new Response(JSON.stringify({ message: 'Goal history is required', ok: false }), { status: 400 })
  }

  const { goalHistory, strategiesHistory, indicatorsHistory } = data

  try {
    const supabase = await createClient()
    const { error } = await supabase.rpc('create_history_snapshot', {
      goal_history: goalHistory,
      strategy_history: strategiesHistory,
      indicator_history: indicatorsHistory,
    })
    if (error) throw error
    const response = { message: 'all was created successfully' }
    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
