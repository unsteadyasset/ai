'use client'

import { useConsoleStore } from '@/lib/store'
import { Satellite } from 'lucide-react'

export function StatusBar() {
  const { cursor, temporalYear } = useConsoleStore()

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-card/90 backdrop-blur-md border-t h-9 flex items-center justify-between px-4 text-[10px] font-mono uppercase">
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground">
          LAT: <span className="text-foreground">{cursor.lat.toFixed(6)}</span>
        </span>
        <span className="text-muted-foreground">
          LNG: <span className="text-foreground">{cursor.lng.toFixed(6)}</span>
        </span>
        <span className="text-muted-foreground hidden md:inline">
          IMAGERY: <span className="text-foreground">MARCH 12, {temporalYear}</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Satellite className="h-3 w-3" />
          <span className="hidden sm:inline">SENTINEL-2 PIPELINE</span>
        </div>
        <span className="text-primary hidden md:inline">© KWS ORBITAL 2026</span>
      </div>
    </div>
  )
}