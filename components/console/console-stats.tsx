'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AlertTriangle, Send, MessageSquare, Sprout } from 'lucide-react'

export function ConsoleStats() {
  const [stats, setStats] = useState({
    active: 0,
    dispatched: 0,
    reports: 0,
    growth: 0,
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [a, d, r, g] = await Promise.all([
        supabase.from('threats').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('threats').select('id', { count: 'exact', head: true }).eq('status', 'dispatched'),
        supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('threats').select('id', { count: 'exact', head: true }).eq('type', 'growth'),
      ])
      setStats({
        active: a.count || 0,
        dispatched: d.count || 0,
        reports: r.count || 0,
        growth: g.count || 0,
      })
    }
    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [])

  const items = [
    { icon: AlertTriangle, label: 'ACTIVE', value: stats.active, color: 'text-destructive' },
    { icon: Send, label: 'DISPATCHED', value: stats.dispatched, color: 'text-amber-500' },
    { icon: MessageSquare, label: 'REPORTS', value: stats.reports, color: 'text-blue-500' },
    { icon: Sprout, label: 'GROWTH', value: stats.growth, color: 'text-emerald-500' },
  ]

  return (
    <div className="absolute top-4 right-4 z-20 flex gap-2">
      {items.map((it) => (
        <div
          key={it.label}
          className="bg-card/90 backdrop-blur-md border rounded-lg px-3 py-2 flex items-center gap-2 shadow-md"
        >
          <it.icon className={`h-3.5 w-3.5 ${it.color}`} />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold">{it.value}</span>
            <span className="text-[8px] font-mono text-muted-foreground tracking-wider">
              {it.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}