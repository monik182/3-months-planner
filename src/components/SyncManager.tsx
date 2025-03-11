'use client'
import { useAccountContext } from '@/app/providers/useAccountContext'
import { useEffect } from 'react'
import { SyncService } from '@/services/sync'

export function SyncManager() {
  const { user, syncInitialized } = useAccountContext()

  useEffect(() => {
    if (!user?.auth0Id || !SyncService.isEnabled || !syncInitialized) return

    const syncInterval = setInterval(() => {
      console.log('**** Setting up periodic sync - 10 minutes interval ****')
      SyncService.processSyncQueue().catch(console.error)
    }, 10 * 60 * 1000)

    return () => clearInterval(syncInterval)
  }, [user, syncInitialized])

  return null
}
