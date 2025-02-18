'use client'
import React, { createContext, useContext } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Center, Spinner } from '@chakra-ui/react'
import { UseUserActions, useUserActions } from '@/app/hooks/useUserActions'
import { UserExtended } from '@/app/types/types'
import { Role } from '@prisma/client'

type AccountContextType = {
  user?: UserExtended | null
  isGuest: boolean
  isLoading: boolean
  userActions: UseUserActions
}

const AccountContext = createContext<AccountContextType | undefined>(
  undefined
)

interface AccountTrackingProviderProps {
  children: React.ReactNode
}

export const AccountProvider = ({ children }: AccountTrackingProviderProps) => {
  const { user: auth0User, isLoading: isLoadingAuth0User } = useUser()
  const userActions = useUserActions()
  const { data: userLocal, isLoading: isLoadingUserLocal } = userActions.useGetLocal()
  const { data: userData, isLoading: isLoadingUserData } = userActions.useGetByAuth0Id(auth0User?.sub as string, !userLocal)
  const isLoading = isLoadingAuth0User || isLoadingUserLocal || isLoadingUserData
  const user = (!userData ? null : { ...userData, sub: auth0User?.sub } as UserExtended) || userLocal
  const isGuest = user?.role === Role.GUEST

  if (isLoading) {
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
        isGuest,
        isLoading,
        userActions,
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
