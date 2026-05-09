'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { TreePine, AlertTriangle, TrendingUp, Sprout } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

interface Stats {
  forestCoverPercent: number
  totalTrees: string
  activeAlerts: number
  countiesGrowing: number
  treesPlanted: string
}

export function HeroStats({ compact = false }: { compact?: boolean }) {
  const [stats, setStats] = useState<Stats>({
    forestCoverPercent: 8.83,
    totalTrees: '3.4B',
    activeAlerts: 0,
    countiesGrowing: 26,
    treesPlanted: '850M',
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: threats } = await supabase
        .from('threats')
        .select('id')
        .eq('status', 'active')
      setStats((s) => ({ ...s, activeAlerts: threats?.length || 0 }))
    }
    load()
  }, [])

  const items = [
    {
      icon: TreePine,
      label: 'NATIONAL FOREST COVER',
      value: `${stats.forestCoverPercent}%`,
      sub: 'Target: 30% by 2032',
      color: 'text-[#006B3F]',
      bg: 'bg-[#006B3F]/10',
    },
    {
      icon: Sprout,
      label: 'TREES PLANTED (15B GOAL)',
      value: stats.treesPlanted,
      sub: 'Toward national pledge',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: AlertTriangle,
      label: 'ACTIVE THREATS',
      value: stats.activeAlerts.toString(),
      sub: 'AI-detected, real-time',
      color: 'text-[#BB0000]',
      bg: 'bg-[#BB0000]/10',
    },
    {
      icon: TrendingUp,
      label: 'COUNTIES GROWING',
      value: `${stats.countiesGrowing}/47`,
      sub: 'Net positive cover',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ]

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3`}>
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.04, y: -4 }}
        >
          <Card
            className={`${
              compact ? 'p-3' : 'p-4'
            } bg-card/85 backdrop-blur-md border-white/10 hover:border-primary/40 transition-all shadow-xl`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-lg ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] md:text-[10px] font-mono tracking-wider text-muted-foreground">
                {item.label}
              </p>
              <p className={`${compact ? 'text-xl' : 'text-2xl'} font-bold tracking-tight`}>
                {item.value}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground">{item.sub}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}