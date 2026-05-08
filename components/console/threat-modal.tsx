'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConsoleStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  X, MapPin, Shield, Clock, Info, Flame, AlertOctagon, TreesIcon, Sprout,
  Sparkles, Navigation, Send, EyeOff, Loader2, ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from '@/lib/format'

interface Threat {
  id: string
  case_id: string
  type: string
  severity: string
  title: string
  description: string
  latitude: number
  longitude: number
  area_hectares: number
  ai_confidence: number
  ndvi_deviation: number
  status: string
  predicted_cause: string
  county: string
  forest_reserve: string
  detected_at: string
}

const typeConfig: Record<string, { icon: any; label: string; color: string }> = {
  forest_fire: { icon: Flame, label: 'FOREST FIRE', color: 'text-destructive' },
  illegal_logging: { icon: AlertOctagon, label: 'ILLEGAL LOGGING', color: 'text-orange-500' },
  encroachment: { icon: TreesIcon, label: 'ENCROACHMENT', color: 'text-amber-500' },
  growth: { icon: Sprout, label: 'FOREST GROWTH', color: 'text-emerald-500' },
  deforestation: { icon: AlertOctagon, label: 'DEFORESTATION', color: 'text-destructive' },
  natural_disaster: { icon: AlertOctagon, label: 'NATURAL DISASTER', color: 'text-amber-500' },
}

const severityStyles: Record<string, string> = {
  critical: 'bg-destructive/15 text-destructive border-destructive/40',
  high: 'bg-orange-500/15 text-orange-500 border-orange-500/40',
  medium: 'bg-amber-500/15 text-amber-500 border-amber-500/40',
  low: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/40',
}

export function ThreatModal() {
  const { selectedThreatId, setSelectedThreat } = useConsoleStore()
  const [threat, setThreat] = useState<Threat | null>(null)
  const [loading, setLoading] = useState(false)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [dispatching, setDispatching] = useState(false)

  useEffect(() => {
    if (!selectedThreatId) {
      setThreat(null)
      setAiSummary(null)
      return
    }
    async function load() {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('threats')
        .select('*')
        .eq('id', selectedThreatId)
        .single()
      if (data) setThreat(data as Threat)
      setLoading(false)
    }
    load()
  }, [selectedThreatId])

  async function generateAiSummary() {
    if (!threat) return
    setAiLoading(true)
    setAiSummary(null)
    try {
      const res = await fetch('/api/threat-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threat }),
      })
      const data = await res.json()
      setAiSummary(data.summary)
    } catch {
      setAiSummary('Failed to generate summary. Try again.')
    }
    setAiLoading(false)
  }

  async function dispatch() {
    if (!threat) return
    setDispatching(true)
    const supabase = createClient()
    await supabase.from('dispatches').insert([
      { threat_id: threat.id, ranger_name: 'Console Admin', notes: 'Dispatched from console' },
    ])
    await supabase.from('threats').update({ status: 'dispatched' }).eq('id', threat.id)
    toast.success(`Team dispatched to ${threat.case_id}`)
    setDispatching(false)
    setSelectedThreat(null)
  }

  async function ignoreThreat() {
    if (!threat) return
    const supabase = createClient()
    await supabase.from('threats').update({ status: 'ignored' }).eq('id', threat.id)
    toast.info(`${threat.case_id} marked as ignored`)
    setSelectedThreat(null)
  }

  const directionsUrl = threat
    ? `https://www.google.com/maps/dir/?api=1&destination=${threat.latitude},${threat.longitude}`
    : '#'

  return (
    <AnimatePresence>
      {selectedThreatId && (
        <motion.div
          initial={{ x: 480, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 480, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="absolute top-4 right-4 bottom-14 w-[420px] max-w-[calc(100vw-2rem)] z-30 bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {loading || !threat ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b bg-gradient-to-br from-card to-muted/30">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight">INTELLIGENCE UNIT</p>
                      <p className="text-[10px] font-mono text-muted-foreground tracking-wider">
                        ADMIN | RANGER CONSOLE
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedThreat(null)}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono mb-3 ${severityStyles[threat.severity]}`}
                >
                  {typeConfig[threat.type]?.label || threat.type.toUpperCase()}
                </Badge>

                <h2 className="text-xl font-bold leading-tight mb-2">{threat.title}</h2>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>LAST SATELLITE PASS: {formatDistanceToNow(new Date(threat.detected_at)).toUpperCase()}</span>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2">
                  <StatCard label="DISTURBANCE AREA" value={`${threat.area_hectares} Ha`} sub="AI VERIFIED" />
                  <StatCard
                    label="AI CONFIDENCE"
                    value={`${(threat.ai_confidence * 100).toFixed(1)}%`}
                    sub="MULTI-BAND SYNC"
                    valueClass="text-emerald-500"
                  />
                  <StatCard
                    label="COORDINATES"
                    value={`${threat.latitude.toFixed(4)}, ${threat.longitude.toFixed(4)}`}
                    sub="WGS84"
                    icon={MapPin}
                    small
                  />
                  <StatCard
                    label="EXTENT"
                    value={threat.county}
                    sub={threat.forest_reserve}
                    icon={Shield}
                    small
                  />
                </div>

                {/* NDVI deviation panel */}
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-destructive flex items-center gap-1.5">
                      <Flame className="h-3 w-3" />
                      LENS: FOREST GUARD
                    </span>
                    <span className="text-lg font-bold text-destructive">
                      {Math.abs(threat.ndvi_deviation * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-destructive/20 overflow-hidden">
                    <div
                      className="h-full bg-destructive transition-all duration-1000"
                      style={{ width: `${Math.min(Math.abs(threat.ndvi_deviation * 100), 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-destructive mt-2 tracking-wider">
                    CRITICAL NDVI DEVIATION DETECTED
                  </p>
                </div>

                {/* Predicted cause */}
                <div className="rounded-xl border bg-muted/30 p-3.5">
                  <p className="text-[10px] font-mono tracking-wider text-muted-foreground mb-1.5">
                    PREDICTED CAUSE (AI ANALYSIS)
                  </p>
                  <p className="text-sm font-medium">{threat.predicted_cause}</p>
                  {threat.description && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {threat.description}
                    </p>
                  )}
                </div>

                {/* AI Summary */}
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-mono tracking-wider text-primary flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      AI INTELLIGENCE BRIEFING
                    </p>
                    {!aiSummary && !aiLoading && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={generateAiSummary}
                        className="h-7 text-[10px] font-mono"
                      >
                        GENERATE
                      </Button>
                    )}
                  </div>
                  {aiLoading && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Analyzing satellite data and patterns...
                    </div>
                  )}
                  {aiSummary && (
                    <div className="text-xs leading-relaxed whitespace-pre-wrap">
                      {aiSummary}
                    </div>
                  )}
                  {!aiSummary && !aiLoading && (
                    <p className="text-xs text-muted-foreground">
                      Click GENERATE to get AI-powered tactical recommendations
                    </p>
                  )}
                </div>

                {/* External actions */}
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-muted/50 transition group"
                >
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Get Directions</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                </a>
              </div>

              {/* Footer actions */}
              <div className="p-3 border-t bg-muted/20 flex gap-2">
                <Button
                  variant="outline"
                  onClick={ignoreThreat}
                  className="flex-1 gap-2"
                  size="sm"
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  Ignore
                </Button>
                <Button
                  onClick={dispatch}
                  disabled={dispatching || threat.status === 'dispatched'}
                  className="flex-1 gap-2"
                  size="sm"
                >
                  {dispatching ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  {threat.status === 'dispatched' ? 'Dispatched' : 'Dispatch Team'}
                </Button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  small,
  valueClass = '',
}: {
  label: string
  value: string
  sub?: string
  icon?: any
  small?: boolean
  valueClass?: string
}) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        {Icon && <Icon className="h-3 w-3 text-muted-foreground" />}
        <p className="text-[9px] font-mono tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
      <p className={`${small ? 'text-xs' : 'text-base'} font-bold ${valueClass}`}>
        {value}
      </p>
      {sub && (
        <p className="text-[9px] font-mono text-muted-foreground mt-0.5 tracking-wider">
          {sub}
        </p>
      )}
    </div>
  )
}