'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Shield, Satellite, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/theme-toggle'

export default function ConsoleLoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/auth/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) {
      toast.success('Authenticated. Loading console...')
      router.push('/console')
    } else {
      toast.error('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <header className="h-14 flex items-center justify-between px-4 border-b">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-4 w-4" />
          Back to public
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <p className="text-[10px] font-mono tracking-widest text-muted-foreground mb-1">
              [ RESTRICTED ACCESS ]
            </p>
            <h1 className="text-xl font-bold text-center">Ranger Console</h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Authorized KWS personnel only
            </p>
          </div>

          <form onSubmit={login} className="space-y-4">
            <div>
              <Label className="text-xs">Admin Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="mt-1"
                autoFocus
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Authenticating...' : 'Access Console'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t flex items-center justify-center gap-2 text-[10px] font-mono text-muted-foreground">
            <Satellite className="h-3 w-3" />
            KWS ORBITAL BACKBONE • SENTINEL-2 PIPELINE
          </div>
        </Card>
      </main>
    </div>
  )
}