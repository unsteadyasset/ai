'use client'

import { useRouter } from 'next/navigation'
import { Bell, LogOut, Satellite, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { toast } from 'sonner'

export function ConsoleTopBar() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/admin', { method: 'DELETE' })
    toast.success('Logged out')
    router.push('/')
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-40 h-12 bg-card/80 backdrop-blur-md border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
          <Satellite className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-bold leading-tight">AI Land Surveillance</p>
          <p className="text-[9px] font-mono text-muted-foreground tracking-widest">
            RANGER CONSOLE • LIVE
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <History className="h-4 w-4" />
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}