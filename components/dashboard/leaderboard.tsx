'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TrendingUp, TrendingDown, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface County {
  id: number
  name: string
  forest_cover_percent: number
  growth_rate_percent: number
  rank: number
}

export function Leaderboard() {
  const [counties, setCounties] = useState<County[]>([])
  const [tab, setTab] = useState<'growth' | 'cover'>('growth')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('counties').select('*')
      if (data) setCounties(data)
    }
    load()
  }, [])

  const sorted = [...counties].sort((a, b) =>
    tab === 'growth'
      ? b.growth_rate_percent - a.growth_rate_percent
      : b.forest_cover_percent - a.forest_cover_percent
  )

  return (
    <Card className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          <h3 className="font-semibold">County Leaderboard</h3>
        </div>
        <div className="flex bg-muted rounded-lg p-0.5">
          <button
            onClick={() => setTab('growth')}
            className={`text-xs px-3 py-1 rounded-md font-mono transition ${
              tab === 'growth' ? 'bg-card shadow-sm' : 'text-muted-foreground'
            }`}
          >
            GROWTH
          </button>
          <button
            onClick={() => setTab('cover')}
            className={`text-xs px-3 py-1 rounded-md font-mono transition ${
              tab === 'cover' ? 'bg-card shadow-sm' : 'text-muted-foreground'
            }`}
          >
            COVER
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1 h-[420px] pr-3">
        <div className="space-y-1">
          {sorted.map((c, i) => {
            const value =
              tab === 'growth' ? c.growth_rate_percent : c.forest_cover_percent
            const isPositive = value >= 0
            return (
              <div
                key={c.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`text-xs font-mono w-6 text-center ${
                      i < 3 ? 'text-amber-500 font-bold' : 'text-muted-foreground'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-medium truncate">{c.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {tab === 'growth' &&
                    (isPositive ? (
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    ))}
                  <span
                    className={`text-sm font-mono font-semibold ${
                      tab === 'growth'
                        ? isPositive
                          ? 'text-emerald-500'
                          : 'text-destructive'
                        : ''
                    }`}
                  >
                    {tab === 'growth' && isPositive ? '+' : ''}
                    {value.toFixed(1)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </Card>
  )
}