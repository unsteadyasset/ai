import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const isConsole = req.nextUrl.pathname.startsWith('/console') &&
                    !req.nextUrl.pathname.startsWith('/console/login')
  
  if (isConsole) {
    const session = req.cookies.get('ranger_session')
    if (!session || session.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/console/login', req.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/console/:path*'],
}