import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const isConsoleRoute =
    req.nextUrl.pathname.startsWith('/console') &&
    !req.nextUrl.pathname.startsWith('/console/login')

  if (isConsoleRoute) {
    const session = req.cookies.get('ranger_session')
    if (!session || session.value !== 'authorized') {
      return NextResponse.redirect(new URL('/console/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/console/:path*'],
}