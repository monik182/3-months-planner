'use client'
import React, { createContext, useContext } from 'react'
import { UseUserActions, useUserActions } from '@/app/hooks/useUserActions'
import { Role } from '@/app/types/models'
import { SyncService } from '@/services/sync'
import { useAuth } from '@/app/providers/AuthProvider'

type AccountContextType = {
  isGuest: boolean
  isLoggedIn: boolean
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
  const { session, user } = useAuth()
  const isLoggedIn = !!session
  const userActions = useUserActions()
  const isGuest = user?.role === Role.GUEST

  return (
    <AccountContext.Provider
      value={{
        isGuest,
        isLoggedIn,
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
