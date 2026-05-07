'use client'

import { useConsoleStore, MapLayer } from '@/lib/store'
import { Layers, Map, Satellite, Mountain, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const layers: { id: MapLayer; label: string; icon: any }[] = [
  { id: 'satellite', label: 'Satellite', icon: Satellite },
  { id: 'ndvi', label: 'NDVI', icon: Map },
  { id: 'terrain', label: 'Terrain', icon: Mountain },
]

export function LayerPicker() {
  const { mapLayer, setMapLayer, showCounties, toggleCounties, showForests, toggleForests } = useConsoleStore()
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute top-4 left-4 z-30">
      <button
        onClick={() => setOpen(!open)}
        className="bg-card/90 backdrop-blur-md border rounded-lg p-2.5 shadow-lg hover:bg-muted transition flex items-center gap-2"
      >
        <Layers className="h-4 w-4" />
        <span className="text-xs font-mono uppercase">Layers</span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 w-56 bg-card/95 backdrop-blur-md border rounded-xl shadow-xl p-2 space-y-1">
          <p className="text-[10px] font-mono uppercase text-muted-foreground px-2 pt-1 pb-2">
            Base Map
          </p>
          {layers.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMapLayer(id)}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm transition ${
                mapLayer === id ? 'bg-primary/15 text-primary' : 'hover:bg-muted'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              {mapLayer === id && (
                <span className="ml-auto text-[10px] font-mono">ACTIVE</span>
              )}
            </button>
          ))}

          <div className="border-t my-2" />
          <p className="text-[10px] font-mono uppercase text-muted-foreground px-2 pb-2">
            Overlays
          </p>
          <button
            onClick={toggleCounties}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-muted"
          >
            {showCounties ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
            Counties
          </button>
          <button
            onClick={toggleForests}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-muted"
          >
            {showForests ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
            Forest Reserves
          </button>
        </div>
      )}
    </div>
  )
}