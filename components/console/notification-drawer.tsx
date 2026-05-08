'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Clock, MapPin, Sparkles, Loader2, ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from '@/lib/format'
import { toast } from 'sonner'

interface Report {
  id: string
  report_type: string
  description: string
  location_text: string
  reporter_name: string
  is_anonymous: boolean
  status: string
  created_at: string
  photo_urls: string[]
}

export function NotificationDrawer() {
  const [open, setOpen] = useState(false)
  const [reports, setReports] = useState<Report[]>([])
  const [unread, setUnread] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)
      if (data) {
        setReports(data as Report[])
        setUnread(data.filter((r: any) => r.status === 'pending').length)
      }
    }
    load()

    const supabase = createClient()
    const channel = supabase
      .channel('reports-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reports' },
        (payload) => {
          const newR = payload.new as Report
          setReports((prev) => [newR, ...prev])
          setUnread((u) => u + 1)
          toast.info(`New report: ${newR.report_type.replace('_', ' ')}`, {
            description: newR.location_text,
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function runAnalysis() {
    setAnalyzing(true)
    setAnalysis(null)
    try {
      const res = await fetch('/api/analyze-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reports: reports.slice(0, 15) }),
      })
      const data = await res.json()
      setAnalysis(data.analysis)
    } catch {
      setAnalysis('Analysis failed. Try again.')
    }
    setAnalyzing(false)
  }

  async function markActioned(id: string) {
    const supabase = createClient()
    await supabase.from('reports').update({ status: 'actioned' }).eq('id', id)
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'actioned' } : r)))
    toast.success('Report marked as actioned')
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen(true)
          setUnread(0)
        }}
        className="relative h-9 w-9 rounded-md hover:bg-muted/50 flex items-center justify-center transition"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-[440px] max-w-[100vw] bg-card border-l z-50 flex flex-col"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Public Reports & Alerts</p>
                  <p className="text-[10px] font-mono text-muted-foreground tracking-wider">
                    REAL-TIME FEED FROM CITIZENS
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* AI Analysis bar */}
              <div className="p-3 border-b bg-primary/5">
                <Button
                  onClick={runAnalysis}
                  disabled={analyzing || reports.length === 0}
                  size="sm"
                  className="w-full gap-2"
                >
                  {analyzing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  {analyzing ? 'Analyzing patterns...' : 'AI Analyze All Reports'}
                </Button>

                {analysis && (
                  <div className="mt-3 p-3 rounded-lg bg-card border text-xs leading-relaxed whitespace-pre-wrap">
                    {analysis}
                  </div>
                )}
              </div>

              <ScrollArea className="flex-1 p-3">
                <div className="space-y-2">
                  {reports.length === 0 && (
                    <div className="text-center py-12 text-sm text-muted-foreground">
                      <AlertCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      No reports yet
                    </div>
                  )}
                  {reports.map((r) => (
                    <div
                      key={r.id}
                      className={`p-3 rounded-lg border transition ${
                        r.status === 'pending'
                          ? 'bg-amber-500/5 border-amber-500/30'
                          : r.status === 'actioned'
                          ? 'bg-emerald-500/5 border-emerald-500/30'
                          : 'bg-card/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="outline" className="text-[9px] font-mono">
                          {r.report_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {formatDistanceToNow(new Date(r.created_at))}
                        </span>
                      </div>
                      <p className="text-sm leading-snug mb-2">{r.description}</p>

                      {r.photo_urls && r.photo_urls.length > 0 && (
                        <div className="grid grid-cols-3 gap-1.5 mb-2">
                          {r.photo_urls.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="aspect-square block"
                            >
                              <img
                                src={url}
                                alt=""
                                className="w-full h-full object-cover rounded border hover:opacity-80 transition"
                              />
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-2">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                          {r.location_text}
                        </span>
                        <span className="flex-shrink-0">
                          {r.is_anonymous ? 'ANON' : r.reporter_name?.toUpperCase()}
                        </span>
                      </div>

                      {r.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-7 text-[10px] font-mono"
                          onClick={() => markActioned(r.id)}
                        >
                          MARK ACTIONED
                        </Button>
                      )}
                      {r.status === 'actioned' && (
                        <p className="text-[10px] font-mono text-emerald-500 text-center">
                          ✓ ACTIONED
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}