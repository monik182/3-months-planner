'use client'
import { useAccountContext } from '@/app/providers/useAccountContext'
import { FloatingFeedback } from '@/components/FeedbackBox'

export function Extra() {
  const { isGuest } = useAccountContext()

  if (!isGuest) return null

  return (
    <div>
      <FloatingFeedback />
    </div>
  )
}
