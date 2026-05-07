import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const adminPassword = process.env.ADMIN_PASSWORD || 'Two Term'

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('ranger_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('ranger_session')
  return NextResponse.json({ ok: true })
}