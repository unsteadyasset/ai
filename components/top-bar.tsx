'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Satellite, Shield, LogOut } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import { NotificationDrawer } from './console/notification-drawer'

interface TopBarProps {
  variant?: 'public' | 'console'
}

export function TopBar({ variant = 'public' }: TopBarProps) {
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/ranger', { method: 'DELETE' })
    router.push('/')
  }

  const statusText = variant === 'console' ? '[ RANGER CONSOLE ACTIVE ]' : '[ PUBLIC DASHBOARD ]'

  return (
    <header className="h-14 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-50 flex-shrink-0">
      <Link href="/" className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <Satellite className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-mono text-muted-foreground tracking-wider">
            AI POWERED
          </span>
          <span className="text-sm font-bold tracking-tight">
            Land Surveillance System
          </span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-1 text-xs font-mono text-muted-foreground">
        {statusText}
      </div>

      <div className="flex items-center gap-1">
        {variant === 'public' && (
          <>
            <Link href="/about" className="hidden sm:block">
              <Button variant="ghost" size="sm">About</Button>
            </Link>
            <Link href="/console/login">
              <Button variant="outline" size="sm" className="gap-2">
                <Shield className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Ranger Login</span>
              </Button>
            </Link>
          </>
        )}
        {variant === 'console' && (
          <>
            <NotificationDrawer />
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-9 w-9"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}