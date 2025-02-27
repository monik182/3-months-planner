import { useMixpanelContext } from '@/app/providers/MixpanelProvider'
import { WaitlistService } from '@/services/waitlist'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'waitlist'
export function useWaitlistActions() {
  const queryClient = useQueryClient()
  const { track } = useMixpanelContext()

  const useCreate = () => {
    return useMutation({
      mutationFn: (waitlist: Prisma.WaitlistCreateInput) => WaitlistService.create(waitlist),
      onSuccess: (data) => {
        track('add_to_waitlist', data)
      }
    })
  }

  const useGet = (token: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { token }],
      queryFn: () => WaitlistService.getByToken(token),
      enabled: !!token,
    })
  }

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ id, updates }: { id: string, updates: Prisma.WaitlistUpdateInput }) => WaitlistService.update(id, updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  return {
    useCreate,
    useGet,
    useUpdate,
  }
}

export type UseWaitlistActions = ReturnType<typeof useWaitlistActions>
