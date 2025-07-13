'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toaster } from '@/components/ui/toaster'
import { useWaitlistActions } from '@/app/hooks/useWaitlistActions'
import { Waitlist } from '@prisma/client'
import { Center, Spinner } from '@chakra-ui/react'

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
    const { data: waitlistData, isLoading: isLoadingWaitlist } = waitlistActions.useGet(token as string)
    const extendedProps = { ...props, token, waitlistData }

    useEffect(() => {
      if (isLoadingWaitlist) return

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
    }, [token, waitlistData, isLoadingWaitlist, router])

    if (isLoadingWaitlist) {
      return (
        <Center height="100vh">
          <Spinner size="xl" />
        </Center>
      )
    }

    return <WrappedComponent {...extendedProps} />
  }

  TokenComponent.displayName = `withToken(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
  return TokenComponent
}

export default withToken
