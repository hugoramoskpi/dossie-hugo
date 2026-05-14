import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME as COOKIE_NAME } from '@/lib/auth-constants'

const PUBLIC_PATHS = ['/login', '/signup']
const PUBLIC_API_PREFIXES = ['/api/auth/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  const isPublicPage = PUBLIC_PATHS.includes(pathname)
  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value

  if (!sessionCookie && !isPublicPage) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (sessionCookie && isPublicPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
