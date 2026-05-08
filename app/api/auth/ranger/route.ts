import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const ADMIN = process.env.ADMIN_PASSWORD || 'Two Term'

  if (password !== ADMIN) {
    return NextResponse.json({ error: 'Invalid' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('ranger_session', 'authorized', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24h
    path: '/',
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('ranger_session')
  return NextResponse.json({ ok: true })
}   