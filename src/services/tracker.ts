export interface TrackerMetrics {
  strategies: Record<string, number[]>
  goals: Record<string, number[]>
}

const getMetrics = async (planId: string): Promise<TrackerMetrics> => {
  const response = await fetch(`/api/tracker/metrics?planId=${planId}`)
  if (!response.ok) {
    return { strategies: {}, goals: {} }
  }
  return response.json()
}

export const TrackerService = { getMetrics }
