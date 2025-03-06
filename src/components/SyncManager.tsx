'use client'
import { useAccountContext } from '@/app/providers/useAccountContext'
import { useEffect } from 'react'
import { SyncService } from '@/services/sync'

export function SyncManager() {
  const { user, syncInitialized } = useAccountContext()

  useEffect(() => {
    if (!user || !SyncService.isEnabled || !syncInitialized) return

    const syncInterval = setInterval(() => {
      console.log('Setting up periodic. Sync 1 hour interval')
      SyncService.processSyncQueue().catch(console.error)
    }, 1 * 60 * 60 * 1000)

    return () => clearInterval(syncInterval)
  }, [user, syncInitialized])

  return null
}
