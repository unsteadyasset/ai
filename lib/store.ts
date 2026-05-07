import { create } from 'zustand'

export type MapLayer = 'satellite' | 'ndvi' | 'terrain'
export type LensMode = 'forest' | 'water' | 'agri'

export interface Threat {
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

interface ConsoleState {
  selectedThreat: Threat | null
  setSelectedThreat: (t: Threat | null) => void
  
  mapLayer: MapLayer
  setMapLayer: (l: MapLayer) => void
  
  lensMode: LensMode
  setLensMode: (m: LensMode) => void
  
  temporalYear: number
  setTemporalYear: (y: number) => void
  
  showCounties: boolean
  toggleCounties: () => void
  
  showForests: boolean
  toggleForests: () => void
  
  threats: Threat[]
  setThreats: (t: Threat[]) => void
  
  cursor: { lat: number; lng: number }
  setCursor: (c: { lat: number; lng: number }) => void
}

export const useConsoleStore = create<ConsoleState>((set) => ({
  selectedThreat: null,
  setSelectedThreat: (t) => set({ selectedThreat: t }),
  
  mapLayer: 'satellite',
  setMapLayer: (l) => set({ mapLayer: l }),
  
  lensMode: 'forest',
  setLensMode: (m) => set({ lensMode: m }),
  
  temporalYear: 2026,
  setTemporalYear: (y) => set({ temporalYear: y }),
  
  showCounties: true,
  toggleCounties: () => set((s) => ({ showCounties: !s.showCounties })),
  
  showForests: true,
  toggleForests: () => set((s) => ({ showForests: !s.showForests })),
  
  threats: [],
  setThreats: (t) => set({ threats: t }),
  
  cursor: { lat: -0.0236, lng: 37.9062 },
  setCursor: (c) => set({ cursor: c }),
}))