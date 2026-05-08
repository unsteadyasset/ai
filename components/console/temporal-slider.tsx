'use client'

import { useConsoleStore } from '@/lib/store'
import { motion } from 'framer-motion'

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026]

export function TemporalSlider() {
  const { year, setYear } = useConsoleStore()
  const isLive = year === 2026

  const percent = ((year - 2021) / (2026 - 2021)) * 100

  return (
    <div className="absolute bottom-14 left-4 z-20 w-[440px] max-w-[calc(100vw-2rem)]">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card/90 backdrop-blur-md border rounded-xl p-4 shadow-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono tracking-widest text-muted-foreground">
            TEMPORAL SCALE
          </span>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
              isLive
                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            {year} {isLive ? '• LIVE' : '• ARCHIVE'}
          </div>
        </div>

        <div className="relative h-8">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 rounded-full" />
          <div
            className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{
              width: `${percent}%`,
              background: isLive ? '#16A34A' : '#F4B740',
            }}
          />

          <div className="absolute inset-0 flex justify-between items-center">
            {YEARS.map((y) => {
              const active = y === year
              const past = y <= year
              let dotClass = 'h-2 w-2 bg-border group-hover:bg-muted-foreground'
              if (active) {
                dotClass = `h-4 w-4 ${isLive ? 'bg-emerald-500' : 'bg-amber-500'} ring-4 ring-background`
              } else if (past) {
                dotClass = 'h-2 w-2 bg-primary'
              }
              return (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className="group flex flex-col items-center"
                >
                  <div className={`rounded-full transition-all ${dotClass}`} />
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex justify-between mt-1.5">
          {YEARS.map((y) => (
            <span
              key={y}
              className={`text-[10px] font-mono ${
                y === year ? 'text-foreground font-bold' : 'text-muted-foreground'
              }`}
            >
              {y}
            </span>
          ))}
        </div>

        {!isLive && (
          <div className="mt-3 pt-3 border-t flex items-center gap-2 text-[10px] font-mono text-amber-500">
            <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
            VIEWING ARCHIVE • COMPARING WITH 2026 LIVE FEED
          </div>
        )}
      </motion.div>
    </div>
  )
}