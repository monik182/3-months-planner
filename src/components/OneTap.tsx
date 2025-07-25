'use client'

import Script from 'next/script'
import { createClient } from '@/app/util/supabase/client'
import { CredentialResponse } from 'google-one-tap'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { generateNonce } from '@/app/util'

interface OneTapProps {
  context: 'signin' | 'signup'
  onError?: (error: string) => void
}

export function OneTap({ context, onError }: OneTapProps) {
  const supabase = createClient()
  const router = useRouter()
  const google = (window as any).google

  useEffect(() => {
    const initializeGoogleOneTap = async () => {
      // console.log('Initializing Google One Tap')
      const [nonce, hashedNonce] = await generateNonce()
      // console.log('Nonce: ', nonce, hashedNonce)

      // check if there's already an existing session before initializing the one-tap UI
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session', error)
      }
      if (data.session) {
        router.push('/')
        return
      }

      if (!google) {
        console.error('Google One Tap not loaded')
        return
      }
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        context,
        callback: async (response: CredentialResponse) => {
          try {
            // send id token returned in response.credential to supabase
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce,
            })

            if (error) throw error
            console.log('-----Session data: ', data)
            console.log('Successfully logged in with Google One Tap')

            // redirect to protected page
            router.push('/')
          } catch (error) {
            console.error('Error logging in with Google One Tap', error)
            console.error('Error logging in with Google One Tap', (error as unknown as Error).message)
            onError?.((error as unknown as Error).message)
          }
        },
        nonce: hashedNonce,
        // with chrome's removal of third-party cookies, we need to use FedCM instead (https://developers.google.com/identity/gsi/web/guides/fedcm-migration)
        use_fedcm_for_prompt: true,
      })
      google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", shape: "pill", width: "100%" }  // customization attributes
      );
      // console.log('Google One Tap initialized', google.accounts.id)
      google.accounts.id.prompt() // Display the One Tap UI
    }
    initializeGoogleOneTap()
  }, [])

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
      <div className="flex justify-center">
        <div id="buttonDiv"></div>
      </div>
    </>
  )
}
