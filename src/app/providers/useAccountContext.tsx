'use client'
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Center, Spinner } from '@chakra-ui/react'
import { UseUserActions, useUserActions } from '@/app/hooks/useUserActions'
import { SyncStatus, UserExtended } from '@/app/types/types'
import { Role } from '@prisma/client'
import { SyncService } from '@/services/sync'
import { validateUserExists } from '@/services/sync/shared'
import { useAuth } from '@/app/providers/AuthContext'
import cuid from 'cuid'

type AccountContextType = {
  user?: UserExtended | null
  isGuest: boolean
  isLoggedIn: boolean
  isLoading: boolean
  syncEnabled: boolean
  syncInitialized: boolean
  syncStatus: SyncStatus
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
  const { data: userLocal, isLoading: isLoadingUserLocal } = userActions.useGetLocal()
  const canFetchUserFromDB = isLoggedIn && SyncService.isEnabled
  const { data: userByAuthId, isLoading: isLoadingUserData } = userActions.useGetByAuth0Id(auth0Id as string, canFetchUserFromDB)
  const isLoading = isLoadingUserLocal || isLoadingUserData
  const user: UserExtended | null = useMemo(() => {
    if (!session || isLoading) return null

    if (isNewUser && !userByAuthId && !userLocal) {
      return {
        id: cuid(),
        role: Role.GUEST,
        email: supabaseUser?.email || '',
        waitlistId: null,
      } as UserExtended
    }
    if (!userByAuthId?.id) {
      return userLocal as UserExtended || null
    } else {
      return { ...userByAuthId, sub: auth0Id, picture: supabaseUser?.user_metadata?.picture } as UserExtended
    }
  }, [isNewUser, userByAuthId, auth0Id, supabaseUser, userLocal, isLoading, session])

  const isGuest = user?.role === Role.GUEST
  const [syncInitialized, setSyncInitialized] = useState(false)
  const [syncStatus, setSyncStatus] = useState({
    pending: 0,
    processing: 0,
    failed: 0,
    total: 0
  })

  const userUpdateAttempted = useRef(false)

  const updateSyncStatus = async () => {
    if (!SyncService.isEnabled) return

    const status = await SyncService.getSyncQueueStatus()
    setSyncStatus(status)
  }

  const triggerSync = async () => {
    if (!SyncService.isEnabled || !isLoggedIn || !user?.auth0Id) return
    
    // Add delay to ensure auth is fully established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      
      console.log(`Initiating first-time sync for user ${user.id}`)
      await validateUserExists(user.id)
      setSyncInitialized(true)
      
      const result = await SyncService.performFirstTimeSync(user.id)
      if (!result.success) {
        console.error(`First-time sync failed: ${result.error}`)
      }
      
      
      updateSyncStatus()
    } catch (error) {
      console.error('Error during initial sync:', error)
      setSyncInitialized(false)
    } finally {
      setSyncInitialized(false)
    }
  }

  useEffect(() => {
    const updateUserWithAuth0Id = async () => {
      if ((!isNewUser && !user) || (isLoading || !user || userUpdateAttempted.current || !isLoggedIn || !auth0Id || user?.auth0Id || userLocal?.auth0Id)) {
        return
      }

      userUpdateAttempted.current = true

      try {
        create.mutate({
          ...user,
          auth0Id,
        }, {
          onSuccess: async () => {
            await SyncService.cleanupSyncQueue()
            await triggerSync()
            userUpdateAttempted.current = false
          },
        })
      } catch (error) {
        console.error('Error updating user with Auth0 ID:', error)
        userUpdateAttempted.current = false
      }
    }

    updateUserWithAuth0Id()
  }, [auth0Id, user, userActions, userLocal, isLoading, isLoggedIn, isNewUser])


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
        syncInitialized,
        syncStatus,
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
