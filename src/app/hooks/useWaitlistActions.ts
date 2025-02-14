import { WaitlistService } from '@/services/waitlist'
import { Prisma } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

export function useWaitlistActions() {

  const useCreate = () => {
    return useMutation({
      mutationFn: (plan: Prisma.WaitlistCreateInput) => WaitlistService.create(plan),
    })
  }

  return {
    useCreate,
  }
}

export type UseWaitlistActions = ReturnType<typeof useWaitlistActions>
