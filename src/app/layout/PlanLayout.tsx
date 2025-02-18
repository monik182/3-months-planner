'use client'
import { usePlanContext } from '@/app/providers/usePlanContext'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PlanLayoutProps {
  children: React.ReactNode
}

const PlanLayout = ({ children }: PlanLayoutProps) => {
  const { plan, hasPlan } = usePlanContext()
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const isPlanRelatedPage = pathname.includes('plan') || pathname.includes('dashboard')

  useEffect(() => {
    if (isPlanRelatedPage) {
      if (!hasPlan) {
        setLoading(false)
        router.replace('/plan/new')
        return
      }
  
      if (hasPlan && !plan?.started) {
        setLoading(false)
        router.replace('/plan')
        return
      }
  
      if (hasPlan && plan?.started) {
        setLoading(false)
        router.replace('/dashboard')
        return
      }
    }

    setLoading(false)
  }, [hasPlan, plan, router, isPlanRelatedPage])

  if (loading) return null

  return <>{children}</>
}

export default PlanLayout
