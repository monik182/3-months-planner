'use client'
import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { Center, Spinner } from '@chakra-ui/react'
import { UseUserActions, useUserActions } from '@/app/hooks/useUserActions'
import { UserExtended } from '@/app/types/types'
import { Role } from '@prisma/client'
import { SyncService } from '@/services/sync'
import { useAuth } from '@/app/providers/AuthContext'
import cuid from 'cuid'

type AccountContextType = {
  user?: UserExtended | null
  isGuest: boolean
  isLoggedIn: boolean
  isLoading: boolean
  syncEnabled: boolean
  userActions: UseUserActions
}

const AccountContext = createContext<AccountContextType | undefined>(
  undefined
)

interface AccountTrackingProviderProps {
  children: React.ReactNode
}

export const AccountProvider = ({ children }: AccountTrackingProviderProps) => {
  const { session, isNewUser, user: supabaseUser } = useAuth()
  const isLoggedIn = !!session
  const auth0Id = supabaseUser?.user_metadata?.sub || supabaseUser?.id
  const userActions = useUserActions()
  const create = userActions.useCreate()
  // const { data: userLocal, isLoading: isLoadingUserLocal } = userActions.useGetLocal()
  const canFetchUserFromDB = isLoggedIn && SyncService.isEnabled
  const { data: userByAuthId, isLoading } = userActions.useGetByAuth0Id(auth0Id as string, canFetchUserFromDB)
  const user: UserExtended | null = useMemo(() => {
    if (!session || isLoading) return null

    if (isNewUser && !userByAuthId) {
      return {
        id: cuid(),
        role: Role.GUEST,
        email: supabaseUser?.email || '',
        waitlistId: null,
      } as UserExtended
    }
    return { ...userByAuthId, sub: auth0Id, picture: supabaseUser?.user_metadata?.picture } as UserExtended
  }, [isNewUser, userByAuthId, auth0Id, supabaseUser, isLoading, session])

  const isGuest = user?.role === Role.GUEST

  const userUpdateAttempted = useRef(false)

  useEffect(() => {
    const updateUserWithAuth0Id = async () => {
      if ((!isNewUser && !user) || (isLoading || !user || userUpdateAttempted.current || !isLoggedIn || !auth0Id || user?.auth0Id)) {
        return
      }

      userUpdateAttempted.current = true

      try {
        create.mutate({
          ...user,
          auth0Id,
        }, {
          onSuccess: async () => {
            userUpdateAttempted.current = false
          },
        })
      } catch (error) {
        console.error('Error updating user with Auth0 ID:', error)
        userUpdateAttempted.current = false
      }
    }

    updateUserWithAuth0Id()
  }, [auth0Id, user, userActions, isLoading, isLoggedIn, isNewUser])


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
        isLoggedIn,
        isLoading,
        userActions,
        syncEnabled: SyncService.isEnabled && isLoggedIn,
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
