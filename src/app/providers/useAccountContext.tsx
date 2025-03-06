'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Center, Spinner } from '@chakra-ui/react'
import { UseUserActions, useUserActions } from '@/app/hooks/useUserActions'
import { UserExtended } from '@/app/types/types'
import { Role } from '@prisma/client'
import { SyncService } from '@/services/sync'
import { db } from '@/db/dexie'

type AccountContextType = {
  user?: UserExtended | null
  isGuest: boolean
  isLoading: boolean
  syncEnabled: boolean
  syncInitialized: boolean
  syncStatus: { pending: number; processing: number; failed: number; total: number }
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
  const userActions = useUserActions()
  const { data: userLocal, isLoading: isLoadingUserLocal } = userActions.useGetLocal()
  const { data: userData, isLoading: isLoadingUserData } = userActions.useGetByAuth0Id(auth0User?.sub as string, !userLocal)
  const isLoading = isLoadingAuth0User || isLoadingUserLocal || isLoadingUserData
  const user = (!userData ? null : { ...userData, sub: auth0User?.sub } as UserExtended) || userLocal
  const isGuest = user?.role === Role.GUEST
  const [syncInitialized, setSyncInitialized] = useState(false)
  const [syncStatus, setSyncStatus] = useState({
    pending: 0,
    processing: 0,
    failed: 0,
    total: 0
  })

  const initialSyncAttempted = useRef(false)

  const updateSyncStatus = async () => {
    if (!SyncService.isEnabled) return

    const status = await SyncService.getSyncQueueStatus()
    setSyncStatus(status)
  }

  const triggerSync = async () => {
    await SyncService.processSyncQueue()
  }

  useEffect(() => {
    if (!user || !SyncService.isEnabled || initialSyncAttempted.current) return

    initialSyncAttempted.current = true

    const performInitialSync = async () => {
      try {

        const preferences = await db.table('userPreferences').get(user.id)

        if (!preferences?.hasSynced) {
          console.log(`Initiating first-time sync for user ${user.id}`)
          const result = await SyncService.performFirstTimeSync(user.id)
          if (!result.success) {
            console.error(`First-time sync failed: ${result.error}`)
          } else {
            console.log(`First-time sync completed successfully`)
          }
        } else {
          console.log(`User ${user.id} has already been synced before`)
        }

        setSyncInitialized(true)
        updateSyncStatus()
      } catch (error) {
        console.error('Error during initial sync:', error)
        setSyncInitialized(true)
      }
    }

    performInitialSync()
  }, [user])

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
        isLoading,
        userActions,
        syncEnabled: SyncService.isEnabled,
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
