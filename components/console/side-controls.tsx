'use client'

import { useConsoleStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { TreePine, Map, Eye, EyeOff } from 'lucide-react'

export function SideControls() {
  const { showCounties, toggleCounties, showReserves, toggleReserves } =
    useConsoleStore()

  return (
    <div className="absolute top-20 left-4 z-20 w-52 space-y-2">
      <Card className="p-3">
        <p className="text-[10px] font-mono tracking-wider text-muted-foreground mb-2">
          MAP OVERLAYS
        </p>
        <div className="space-y-1">
          <button
            onClick={toggleCounties}
            className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition text-sm"
          >
            <span className="flex items-center gap-2">
              <Map className="h-3.5 w-3.5 text-primary" />
              Counties
            </span>
            {showCounties ? (
              <Eye className="h-3.5 w-3.5 text-primary" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>

          <button
            onClick={toggleReserves}
            className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition text-sm"
          >
            <span className="flex items-center gap-2">
              <TreePine className="h-3.5 w-3.5 text-primary" />
              Reserves
            </span>
            {showReserves ? (
              <Eye className="h-3.5 w-3.5 text-primary" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        </div>
      </Card>

      <Card className="p-3">
        <p className="text-[10px] font-mono tracking-wider text-muted-foreground mb-2">
          THREAT LEGEND
        </p>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Growth / Low</span>
          </div>
        </div>
      </Card>
    </div>
  )
}