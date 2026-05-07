'use client'

import { useConsoleStore, LensMode } from '@/lib/store'
import { TreePine, Droplet, Wheat } from 'lucide-react'

const lenses: { mode: LensMode; label: string; icon: any }[] = [
  { mode: 'forest', label: 'Forest Guard', icon: TreePine },
  { mode: 'water', label: 'Water Guard', icon: Droplet },
  { mode: 'agri', label: 'Agri-Guard', icon: Wheat },
]

export function LensPills() {
  const { lensMode, setLensMode } = useConsoleStore()

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex gap-2 bg-card/80 backdrop-blur-md p-1.5 rounded-full border shadow-lg">
      {lenses.map(({ mode, label, icon: Icon }) => (
        <button
          key={mode}
          onClick={() => setLensMode(mode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition ${
            lensMode === mode
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  )
}