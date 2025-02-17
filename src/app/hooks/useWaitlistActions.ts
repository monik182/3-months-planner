import { WaitlistService } from '@/services/waitlist'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'

const QUERY_KEY = 'waitlist'
export function useWaitlistActions() {

  const useCreate = () => {
    return useMutation({
      mutationFn: (waitlist: Prisma.WaitlistCreateInput) => WaitlistService.create(waitlist),
    })
  }


  const useGet = (token: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { token }],
      queryFn: () => WaitlistService.getByToken(token),
      enabled: !!token,
    })
  }

  return {
    useCreate,
    useGet,
  }
}

export type UseWaitlistActions = ReturnType<typeof useWaitlistActions>
