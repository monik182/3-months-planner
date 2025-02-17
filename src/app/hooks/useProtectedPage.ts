import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccountContext } from '@/app/providers/useAccountContext'

export function useProtectedPage(redirectTo = '/') {
  const { user, isLoading } = useAccountContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(redirectTo)
    }
  }, [user, isLoading, router, redirectTo])

  return { user, isLoading }
}
