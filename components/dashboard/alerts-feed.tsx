'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Flame, TreesIcon, AlertOctagon, Sprout } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from '@/lib/format'

interface Threat {
  id: string
  case_id: string
  type: string
  severity: string
  title: string
  county: string
  detected_at: string
  status: string
}

const typeIcons: Record<string, any> = {
  forest_fire: Flame,
  illegal_logging: AlertOctagon,
  encroachment: TreesIcon,
  growth: Sprout,
  deforestation: AlertOctagon,
  natural_disaster: AlertOctagon,
}

const severityColors: Record<string, string> = {
  critical: 'bg-destructive/15 text-destructive border-destructive/30',
  high: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
  medium: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  low: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
}

export function AlertsFeed() {
  const [threats, setThreats] = useState<Threat[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('threats')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(20)
      if (data) setThreats(data as Threat[])
    }
    load()
  }, [])

  return (
    <Card className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <h3 className="font-semibold">Live Threat Feed</h3>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          REAL-TIME
        </span>
      </div>

      <ScrollArea className="flex-1 h-[420px] pr-3">
        <div className="space-y-2">
          {threats.map((t) => {
            const Icon = typeIcons[t.type] || AlertOctagon
            return (
              <div
                key={t.id}
                className="p-3 rounded-lg border bg-card/50 hover:bg-muted/40 transition group cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-muted/50 flex-shrink-0">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {t.case_id}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 h-4 font-mono ${
                          severityColors[t.severity]
                        }`}
                      >
                        {t.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.county} • {formatDistanceToNow(new Date(t.detected_at))}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </Card>
  )
}