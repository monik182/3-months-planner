export const ORDER_EXPIRATION_MS = 30 * 60 * 1000 // 30 minutes

function key(planId: string) {
  return `strategy_order_${planId}`
}

export function getStrategyOrder(planId: string): string[] | null {
  if (typeof window === 'undefined') return null
  try {
    const item = localStorage.getItem(key(planId))
    if (!item) return null
    const data = JSON.parse(item) as { order: string[]; timestamp: number }
    if (Date.now() - data.timestamp > ORDER_EXPIRATION_MS) {
      localStorage.removeItem(key(planId))
      return null
    }
    return data.order
  } catch {
    return null
  }
}

export function setStrategyOrder(planId: string, order: string[]) {
  if (typeof window === 'undefined') return
  const data = { order, timestamp: Date.now() }
  localStorage.setItem(key(planId), JSON.stringify(data))
}

export function clearStrategyOrder() {
  if (typeof window === 'undefined') return
  Object.keys(localStorage).forEach((k) => {
    if (k.startsWith('strategy_order_')) {
      localStorage.removeItem(k)
    }
  })
}

export function getOrderedStrategies<T>(planId: string, strategies: (T & { id: string; createdAt: Date | null })[]): T[] {
  const order = getStrategyOrder(planId)
  if (!order) return strategies
  const orderMap = new Map(order.map((id, idx) => [id, idx]))
  const sorted = [...strategies].sort((a, b) => {
    const ia = orderMap.get(a.id)
    const ib = orderMap.get(b.id)
    if (ia !== undefined && ib !== undefined) return ia - ib
    if (ia !== undefined) return -1
    if (ib !== undefined) return 1
    return new Date(a.createdAt ?? new Date()).getTime() - new Date(b.createdAt ?? new Date()).getTime()
  })
  return sorted
}
