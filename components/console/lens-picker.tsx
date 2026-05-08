'use client'

import { useConsoleStore, MapLayer } from '@/lib/store'
import { Satellite, Layers, Mountain, Map as MapIcon } from 'lucide-react'

const LAYERS: { id: MapLayer; label: string; icon: any }[] = [
  { id: 'satellite', label: 'SATELLITE', icon: Satellite },
  { id: 'ndvi', label: 'NDVI', icon: Layers },
  { id: 'terrain', label: 'TERRAIN', icon: Mountain },
  { id: 'streets', label: 'NAVIGATE', icon: MapIcon },
]

export function LensPicker() {
  const { layer, setLayer } = useConsoleStore()

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
      <div className="flex bg-card/90 backdrop-blur-md border rounded-full p-1 shadow-lg">
        {LAYERS.map((l) => {
          const active = layer === l.id
          return (
            <button
              key={l.id}
              onClick={() => setLayer(l.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-wider transition ${
                active
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <l.icon className="h-3 w-3" />
              {l.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}