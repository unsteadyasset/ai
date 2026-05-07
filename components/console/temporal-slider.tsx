'use client'

import { useConsoleStore } from '@/lib/store'
import { Clock } from 'lucide-react'

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026]

export function TemporalSlider() {
  const { temporalYear, setTemporalYear } = useConsoleStore()
  const isLive = temporalYear === 2026

  return (
    <div className="absolute bottom-12 left-4 z-30 w-[420px] max-w-[calc(100vw-2rem)]">
      <div className="bg-card/90 backdrop-blur-md border rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Temporal Scale
            </span>
          </div>
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
            isLive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
          }`}>
            {temporalYear} {isLive && '• LIVE'}
          </div>
        </div>

        <div className="relative">
          <input
            type="range"
            min={2021}
            max={2026}
            step={1}
            value={temporalYear}
            onChange={(e) => setTemporalYear(Number(e.target.value))}
            className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-2 px-0.5">
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => setTemporalYear(year)}
                className={`text-[10px] font-mono ${
                  year === temporalYear ? 'text-primary font-bold' : 'text-muted-foreground'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}