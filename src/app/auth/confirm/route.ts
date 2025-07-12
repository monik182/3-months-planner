import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/app/util/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const token = searchParams.get('token') as EmailOtpType | null
  const next = type === 'recovery' ? '/reset' : '/login'

  if (token_hash && type && token) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    const cookieStore = await cookies();

    if (!error) {
      // redirect user to specified redirect URL or root of app
      cookieStore.set('recovery_token', token, {
        path: next,
        httpOnly: true,
        maxAge: 60,
      });

      redirect(next)
    } else {

      const errorMessage = error ? error.message : 'Error confirming email'

      // TODO: FIXME: How do we want to handle this error? Error page? Home page with error? Login page with error? Recover password page with error?
      cookieStore.set('confirm_error', errorMessage, {
        path: next,
        httpOnly: true,
        maxAge: 60,
      });
    }
  }

  // redirect the user to an error page with some instructions
  redirect(next)
}
