'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toaster } from '@/components/ui/toaster'
import { useWaitlistActions } from '@/app/hooks/useWaitlistActions'
import { Waitlist } from '@prisma/client'
import { useAccountContext } from '@/app/providers/useAccountContext'

export interface WithTokenPageProps {
  params: {
    userId: string
  }
  token: string
  waitlistData: Waitlist
}

const withToken = (WrappedComponent: React.FC<WithTokenPageProps>) => {
  const TokenComponent = (props: any) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const waitlistActions = useWaitlistActions()
    const { user, isLoading } = useAccountContext()
    const { data: waitlistData, isLoading: isLoadingWaitlist } = waitlistActions.useGet(token as string)
    const extendedProps = { ...props, token, waitlistData }
    const loading = isLoadingWaitlist || isLoading

    useEffect(() => {
      if (loading) return

      if (user) {
        router.replace('/plan')
        return
      }

      if (!token) {
        router.replace('/')
      } else if (token && !waitlistData) {
        toaster.create({
          type: 'info',
          title: 'Invalid Token',
          description: 'The token you provided is invalid. Please try logging in.',
        })
        router.replace('/')
      } else if (!waitlistData?.invited) {
        toaster.create({
          type: 'info',
          title: 'Invitation Pending',
          description: 'You have not been invited yet. Please wait for an invitation to gain access.'
        })
      }
    }, [token, waitlistData, loading, user, router])

    if (loading) return null

    return <WrappedComponent {...extendedProps} />
  }

  TokenComponent.displayName = `withToken(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
  return TokenComponent
}

export default withToken
