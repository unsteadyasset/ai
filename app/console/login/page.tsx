'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Shield, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function ConsoleLoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/auth/ranger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      toast.success('Access granted. Welcome, Ranger.')
      router.push('/console')
    } else {
      toast.error('Access denied. Invalid credentials.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-primary/15 items-center justify-center mb-4">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Ranger Console</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Restricted access — KWS authorized personnel only
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono tracking-wider">
                ADMIN PASSWORD
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter dispatch passphrase"
                  className="pl-9 h-10 font-mono"
                  required
                  autoFocus
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-10">
              {loading ? 'Authenticating...' : 'Authorize Access'}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <span>SESSION TIMEOUT: 24H</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SECURE
            </span>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Unauthorized access is logged and prosecutable under Kenyan law.
        </p>
      </motion.div>
    </div>
  )
}