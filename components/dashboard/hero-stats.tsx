'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { TreePine, AlertTriangle, TrendingUp, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

interface Stats {
  forestCoverPercent: number
  totalTrees: number
  activeAlerts: number
  countiesGrowing: number
}

export function HeroStats() {
  const [stats, setStats] = useState<Stats>({
    forestCoverPercent: 0,
    totalTrees: 0,
    activeAlerts: 0,
    countiesGrowing: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: counties } = await supabase.from('counties').select('*')
      const { data: threats } = await supabase
        .from('threats')
        .select('id')
        .eq('status', 'active')

      if (counties) {
        const avg =
          counties.reduce((s, c) => s + (c.forest_cover_percent || 0), 0) /
          counties.length
        const total = counties.reduce(
          (s, c) => s + (Number(c.total_trees_estimate) || 0),
          0
        )
        const growing = counties.filter((c) => (c.growth_rate_percent || 0) > 0)
          .length

        setStats({
          forestCoverPercent: Number(avg.toFixed(1)),
          totalTrees: total,
          activeAlerts: threats?.length || 0,
          countiesGrowing: growing,
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  const formatTrees = (n: number) => {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
    return n.toLocaleString()
  }

  const items = [
    {
      icon: TreePine,
      label: 'NATIONAL FOREST COVER',
      value: `${stats.forestCoverPercent}%`,
      sub: 'Target: 30% by 2032',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: MapPin,
      label: 'ESTIMATED TREES',
      value: formatTrees(stats.totalTrees),
      sub: 'Across all 47 counties',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: AlertTriangle,
      label: 'ACTIVE ALERTS',
      value: stats.activeAlerts.toString(),
      sub: 'AI-detected threats',
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    {
      icon: TrendingUp,
      label: 'COUNTIES GROWING',
      value: `${stats.countiesGrowing}/47`,
      sub: 'Net positive growth',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-mono tracking-wider text-muted-foreground">
                {item.label}
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {loading ? '...' : item.value}
              </p>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}