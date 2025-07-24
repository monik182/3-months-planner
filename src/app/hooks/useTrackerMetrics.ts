import { TrackerService, TrackerMetrics } from '@/services/tracker'
import { useQuery } from '@tanstack/react-query'

const QUERY_KEY = 'tracker-metrics'

export function useTrackerMetrics(planId: string) {
  return useQuery<TrackerMetrics>({
    queryKey: [QUERY_KEY, { planId }],
    queryFn: () => TrackerService.getMetrics(planId),
    enabled: !!planId,
  })
}

export type UseTrackerMetrics = ReturnType<typeof useTrackerMetrics>
