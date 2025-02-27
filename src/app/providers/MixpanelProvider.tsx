'use client'
import { initMixpanel } from '@/lib/mixpanelClient'
import { OverridedMixpanel } from 'mixpanel-browser'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

type MixpanelContextType = {
  track: (event: string, props?: Record<string, any>) => void
}

const MixpanelContext = createContext<MixpanelContextType | undefined>(
  undefined
)

export const MixpanelProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() 
  const [mixpanel, setMixpanel] = useState<OverridedMixpanel>()
  useEffect(() => {
    const mixpanel = initMixpanel()
    if (mixpanel) setMixpanel(mixpanel)
  }, [])

  function track(event: string, props?: Record<string, any>) {
    if (!mixpanel) {
      console.warn('Mixpanel token is missing! Check your .env file.')
      return
    }

    mixpanel.track(event, props)
  }

  useEffect(() => {
    if (!mixpanel) return
    track('page_view', { page: pathname })
  }, [pathname])


  return (
    <MixpanelContext.Provider value={{ track }}>{children}</MixpanelContext.Provider>
  )
}

export const useMixpanelContext = (): MixpanelContextType => {
  const context = useContext(MixpanelContext)
  if (!context) {
    throw new Error(
      'useMixpanel must be used within a MixpanelProvider'
    )
  }
  return context
}
