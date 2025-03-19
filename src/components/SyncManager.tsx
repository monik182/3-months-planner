'use client'
import { useAccountContext } from '@/app/providers/useAccountContext'
import { SyncService } from '@/services/sync'
import { useEffect } from 'react'

export function SyncManager() {
  const { syncInitialized, isLoggedIn } = useAccountContext()

  useEffect(() => {
    if (!isLoggedIn || !SyncService.isEnabled || !syncInitialized) return

    SyncService.processSyncQueue().catch(console.error)

    // Set up periodic sync (every 10 minutes)
    const syncInterval = setInterval(() => {
      SyncService.processSyncQueue().catch(console.error)
    }, 10 * 60 * 1000) // 10 minutes

    // Clean up completed items daily
    const cleanupInterval = setInterval(() => {
      SyncService.cleanupCompletedItems(24 * 60 * 60 * 1000).catch(console.error)
    }, 24 * 60 * 60 * 1000) // 24 hours

    return () => {
      clearInterval(syncInterval)
      clearInterval(cleanupInterval)
    };
  }, [isLoggedIn, syncInitialized])

  return null // This component doesn't render anything
}
