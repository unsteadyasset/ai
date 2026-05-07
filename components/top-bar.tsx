'use client'

import Link from 'next/link'
import { Satellite, Bell, Shield } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'

interface TopBarProps {
  variant?: 'public' | 'console'
}

export function TopBar({ variant = 'public' }: TopBarProps) {
  return (
    <header className="h-14 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <Satellite className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-mono text-muted-foreground tracking-wider">
            AI POWERED
          </span>
          <span className="text-sm font-bold tracking-tight">
            Land Surveillance System
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-1 text-xs font-mono text-muted-foreground">
        {variant === 'console' ? '[ RANGER CONSOLE ACTIVE ]' : '[ PUBLIC DASHBOARD ]'}
      </div>

      <div className="flex items-center gap-2">
        {variant === 'public' && (
          <Link href="/console/login">
            <Button variant="outline" size="sm" className="gap-2">
              <Shield className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Ranger Login</span>
            </Button>
          </Link>
        )}
        {variant === 'console' && (
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}