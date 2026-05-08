import { create } from 'zustand'

export type MapLayer = 'satellite' | 'ndvi' | 'terrain' | 'streets'
export type LensMode = 'forest' | 'water' | 'agri'

interface ConsoleState {
  selectedThreatId: string | null
  setSelectedThreat: (id: string | null) => void

  layer: MapLayer
  setLayer: (l: MapLayer) => void

  lens: LensMode
  setLens: (l: LensMode) => void

  year: number
  setYear: (y: number) => void

  showCounties: boolean
  toggleCounties: () => void

  showReserves: boolean
  toggleReserves: () => void
}

export const useConsoleStore = create<ConsoleState>((set) => ({
  selectedThreatId: null,
  setSelectedThreat: (id) => set({ selectedThreatId: id }),

  layer: 'satellite',
  setLayer: (l) => set({ layer: l }),

  lens: 'forest',
  setLens: (l) => set({ lens: l }),

  year: 2026,
  setYear: (y) => set({ year: y }),

  showCounties: true,
  toggleCounties: () => set((s) => ({ showCounties: !s.showCounties })),

  showReserves: true,
  toggleReserves: () => set((s) => ({ showReserves: !s.showReserves })),
}))