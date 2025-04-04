'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Center, Spinner } from '@chakra-ui/react'
import { UseUserActions, useUserActions } from '@/app/hooks/useUserActions'
import { SyncStatus, UserExtended } from '@/app/types/types'
import { Role } from '@prisma/client'
import { SyncService } from '@/services/sync'
import { userPreferencesHandler } from '@/db/dexieHandler'
import { validateUserExists } from '@/services/sync/shared'

type AccountContextType = {
  user?: UserExtended | null
  isGuest: boolean
  isLoggedIn: boolean
  isLoading: boolean
  syncEnabled: boolean
  syncInitialized: boolean
  syncStatus: SyncStatus
  userActions: UseUserActions
  triggerSync: () => Promise<void>
}

const AccountContext = createContext<AccountContextType | undefined>(
  undefined
)

interface AccountTrackingProviderProps {
  children: React.ReactNode
}

export const AccountProvider = ({ children }: AccountTrackingProviderProps) => {
  const { user: auth0User, isLoading: isLoadingAuth0User } = useUser()
  const isLoggedIn = !!auth0User
  const userActions = useUserActions()
  const create = userActions.useCreate()
  const { data: userLocal, isLoading: isLoadingUserLocal } = userActions.useGetLocal()
  const canFetchUserFromDB = !isLoadingAuth0User && isLoggedIn && SyncService.isEnabled
  const { data: userData, isLoading: isLoadingUserData } = userActions.useGetByAuth0Id(auth0User?.sub as string, canFetchUserFromDB)
  const isLoading = isLoadingAuth0User || isLoadingUserLocal || isLoadingUserData
  const user = (!userData?.id ? null : { ...userData, sub: auth0User?.sub, picture: auth0User?.picture } as UserExtended) || userLocal
  const isGuest = user?.role === Role.GUEST
  const [syncInitialized, setSyncInitialized] = useState(false)
  const [syncStatus, setSyncStatus] = useState({
    pending: 0,
    processing: 0,
    failed: 0,
    total: 0
  })

  const initialSyncAttempted = useRef(false)
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
      const preferences = await userPreferencesHandler.findOne(user.id)
      
      if (!preferences?.hasSynced) {
        console.log(`Initiating first-time sync for user ${user.id}`)
        // First ensure user exists
        await validateUserExists(user.id)
        
        const result = await SyncService.performFirstTimeSync(user.id)
        if (!result.success) {
          console.error(`First-time sync failed: ${result.error}`)
        }
      } else {
        await SyncService.processSyncQueue()
      }
      
      setSyncInitialized(true)
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
      if (isLoading || !user || userUpdateAttempted.current || !isLoggedIn || !auth0User?.sub || user?.auth0Id || userLocal?.auth0Id) {
        return
      }

      userUpdateAttempted.current = true

      try {
        console.log(`Updating user ${user.id} with Auth0 ID ${auth0User.sub}`)
        create.mutate({
          ...user,
          auth0Id: auth0User.sub,
        }, {
          onSuccess() {
            triggerSync()
            userUpdateAttempted.current = false
          },
        })
      } catch (error) {
        console.error('Error updating user with Auth0 ID:', error)
        userUpdateAttempted.current = false
      }
    }

    updateUserWithAuth0Id()
  }, [auth0User, user, userActions, userLocal, isLoading, isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn || !SyncService.isEnabled || initialSyncAttempted.current || userUpdateAttempted.current) return

    initialSyncAttempted.current = true
    triggerSync()

  }, [user, isLoggedIn])

  useEffect(() => {
    if (!SyncService.isEnabled || !syncInitialized) return

    const statusInterval = setInterval(() => {
      updateSyncStatus()
    }, 10000)

    return () => clearInterval(statusInterval)
  }, [syncInitialized])

  useEffect(() => {
    if (!SyncService.isEnabled || !syncInitialized) return

    const cleanupInterval = setInterval(() => {
      SyncService.cleanupSyncQueue()
    }, 24 * 60 * 60 * 1000)

    return () => clearInterval(cleanupInterval)
  }, [syncInitialized])

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
        triggerSync,
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
