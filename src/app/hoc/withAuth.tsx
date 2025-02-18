'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccountContext } from '@/app/providers/useAccountContext'

const withAuth = (WrappedComponent: React.FC) => {
  const AuthComponent = (props: any) => {
    const router = useRouter()
    const { user, isGuest } = useAccountContext()

    useEffect(() => {

      if (!user || !isGuest) {
        router.replace('/')
      }
    }, [])

    return <WrappedComponent {...props} />
  }

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
  return AuthComponent
}

export default withAuth
