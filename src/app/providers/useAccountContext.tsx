'use client'
import React, { createContext, useContext, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Center, Spinner } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useWaitlistActions } from '@/app/hooks/useWaitlistActions'
import { toaster } from '@/components/ui/toaster'
import { useUserActions } from '@/app/hooks/useUserActions'
import { UserExtended } from '@/app/types/types'

type AccountContextType = {
  user?: UserExtended
  isLoading: boolean
}

const AccountContext = createContext<AccountContextType | undefined>(
  undefined
)

interface AccountTrackingProviderProps {
  children: React.ReactNode
}

export const AccountProvider = ({ children }: AccountTrackingProviderProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user: auth0User, isLoading: isLoadingAuth0User } = useUser()
  const token = searchParams.get('token')
  const waitlistActions = useWaitlistActions()
  const userActions = useUserActions()
  const { data: waitlistData, isLoading: isLoadingWaitlist } = waitlistActions.useGet(token as string)
  const { data: userData = {}, isLoading: isLoadingUser } = userActions.useGetByEmail(waitlistData?.email as string)
  const loading = isLoadingAuth0User || isLoadingWaitlist || isLoadingUser
  const user = { ...userData, sub: auth0User?.sub } as UserExtended

  useEffect(() => {
    if (loading) return

    if (!auth0User && !token) {
      router.replace('/')
    } else if (token && !waitlistData) {
      toaster.create({
        type: 'info',
        title: 'Invalid Token',
        description: 'The token you provided is invalid. Please try logging in.',
      })
      router.replace('/')
    }
  }, [auth0User, token, waitlistData, loading])

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <AccountContext.Provider
      value={{
        user,
        isLoading: loading,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export const useAccountContext = (): AccountContextType => {
  const context = useContext(AccountContext)
  if (!context) {
    throw new Error(
      'useAccount must be used within a AccountProvider'
    )
  }
  return context
}
