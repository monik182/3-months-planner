import { type NextRequest } from 'next/server'
import { updateSession } from '@/app/util/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    // '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // '/((?!api|_next/static|_next/image|_next/src|_next/internal|src/lib|src/packages|\\.well-known|favicon\\.ico|login|signup|recover-password|reset|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // '/((?!api|_next|favicon\\.ico|login|signup|recover-password|reset|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
    // '/((?!api|_next|\\.well-known|favicon\\.ico|login|signup|recover-password|reset|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|ts|js|json|map)$).*)',
    // '/((?!_next/|api/|static/).*)',
    '/((?!_next/(?:static|image)|api/|static/|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
