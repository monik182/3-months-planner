import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    console.error('Error fetching user in middleware:', userError.message)
  }


  const { pathname } = request.nextUrl

  // define your protected/unprotected routes
  const isAuthPage = ['/login', '/signup', '/recovery', '/recover-password', '/auth', '/'].includes(pathname)
  const isDashboard = pathname.startsWith('/dashboard')
  const isPlanNew = pathname === '/plan/new'
  const isPlan = pathname === '/plan'

  // 3) If no user → only allow auth pages
  if (!user && !isAuthPage && !userError) {
    console.log('No user, redirecting to login', request.nextUrl.pathname)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 4) If user is logged in → block auth pages
  if (user && isAuthPage) {
    console.log('User, redirecting to dashboard', request.nextUrl.pathname)
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }


  // 5) For logged-in users, enforce plan logic
  if (user) {
    // fetch the user's current plan (not completed)
    const { data: plan } = await supabase
      .from('plans')
      .select('id, started')
      .eq('user_id', user.id)
      .eq('completed', false)
      .maybeSingle()

    if (!plan && pathname !== '/plan/new') {
      return NextResponse.redirect(new URL('/plan/new', request.url))
    }

    if (plan && !plan.started && !isPlan) {
      return NextResponse.redirect(new URL('/plan', request.url))
    }

    if (plan && plan.started && !isDashboard) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
