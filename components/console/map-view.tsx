'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl, { Map as MLMap } from 'maplibre-gl'
import { createClient } from '@/lib/supabase/client'
import { useConsoleStore } from '@/lib/store'

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY

const STYLES: Record<string, string> = {
  satellite: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`,
  streets: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`,
  terrain: `https://api.maptiler.com/maps/landscape/style.json?key=${MAPTILER_KEY}`,
  ndvi: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`,
}

interface Threat {
  id: string
  case_id: string
  type: string
  severity: string
  title: string
  latitude: number
  longitude: number
  status: string
  detected_at: string
}

interface NdviSnapshot {
  reserve_name: string
  year: number
  avg_ndvi: number
  centroid_lat: number
  centroid_lng: number
  loss_area_ha: number
  gain_area_ha: number
}

interface LowCanopy {
  id: number
  name: string
  county: string
  latitude: number
  longitude: number
  current_cover_percent: number
  priority: string
}

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MLMap | null>(null)
  const [threats, setThreats] = useState<Threat[]>([])
  const [ndviData, setNdviData] = useState<NdviSnapshot[]>([])
  const [lowCanopy, setLowCanopy] = useState<LowCanopy[]>([])
  const [coords, setCoords] = useState({ lat: -0.0236, lng: 37.9062 })
  const [error, setError] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState(false)

  const { layer, year, setSelectedThreat, showCounties, showReserves } =
    useConsoleStore()

  useEffect(() => {
    if (!MAPTILER_KEY) setError('MapTiler key missing')
  }, [])

  // Load all data
  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [threatsRes, ndviRes, lowRes] = await Promise.all([
        supabase.from('threats').select('*').in('status', ['active', 'dispatched']),
        supabase.from('ndvi_snapshots').select('*'),
        supabase.from('low_canopy_zones').select('*'),
      ])
      if (threatsRes.data) setThreats(threatsRes.data as Threat[])
      if (ndviRes.data) setNdviData(ndviRes.data as NdviSnapshot[])
      if (lowRes.data) setLowCanopy(lowRes.data as LowCanopy[])
    }
    load()
  }, [])

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPTILER_KEY) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLES[layer],
      center: [37.9062, -0.0236],
      zoom: 6,
      attributionControl: false,
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-right')
    map.on('mousemove', (e) => setCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng }))
    map.on('error', (e) => console.error('MapLibre error:', e.error))

    map.on('load', () => {
      setMapReady(true)
      addBaseOverlays(map)
    })

    mapRef.current = map

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Switch style
  useEffect(() => {
    if (!mapRef.current || !mapReady) return
    mapRef.current.setStyle(STYLES[layer])
    mapRef.current.once('styledata', () => {
      addBaseOverlays(mapRef.current!)
    })
  }, [layer, mapReady])

  // Toggle layers
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    const apply = () => {
      ;['counties-fill', 'counties-line'].forEach((id) => {
        if (map.getLayer(id))
          map.setLayoutProperty(id, 'visibility', showCounties ? 'visible' : 'none')
      })
      ;['reserves-fill', 'reserves-line', 'reserves-labels'].forEach((id) => {
        if (map.getLayer(id))
          map.setLayoutProperty(id, 'visibility', showReserves ? 'visible' : 'none')
      })
    }
    if (map.isStyleLoaded()) apply()
    else map.once('idle', apply)
  }, [showCounties, showReserves, mapReady])

  // Threat markers (only show if year is current OR threat date matches)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady || threats.length === 0) return

    const isLive = year === 2026
    const visibleThreats = isLive
      ? threats
      : threats.filter((t) => new Date(t.detected_at).getFullYear() === year)

    const markers: maplibregl.Marker[] = []
    visibleThreats.forEach((t) => {
      const el = document.createElement('div')
      el.style.cursor = 'pointer'
      el.style.width = '24px'
      el.style.height = '24px'
      el.style.position = 'relative'

      const color =
        t.severity === 'critical'
          ? '#E04444'
          : t.severity === 'high'
          ? '#F97316'
          : t.severity === 'medium'
          ? '#F4B740'
          : '#16A34A'

      el.innerHTML = `
        <div style="position:absolute;inset:0;border-radius:9999px;background:${color};opacity:0.4;animation:pulse-ring 1.5s ease-out infinite;"></div>
        <div style="position:absolute;inset:0;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.4);animation:pulse-threat 1.5s ease-in-out infinite;"></div>
      `
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        setSelectedThreat(t.id)
        map.flyTo({ center: [t.longitude, t.latitude], zoom: 13, duration: 1500 })
      })
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([t.longitude, t.latitude])
        .addTo(map)
      markers.push(marker)
    })

    return () => markers.forEach((m) => m.remove())
  }, [threats, mapReady, year, setSelectedThreat])

  // NDVI overlay (when layer is ndvi) — color reserves by NDVI value for selected year
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    const apply = () => {
      // Remove existing ndvi heat circles
      if (map.getLayer('ndvi-heat')) map.removeLayer('ndvi-heat')
      if (map.getSource('ndvi-heat')) map.removeSource('ndvi-heat')

      if (layer !== 'ndvi' || ndviData.length === 0) return

      const yearData = ndviData.filter((d) => d.year === year)
      const features = yearData.map((d) => ({
        type: 'Feature' as const,
        properties: {
          ndvi: d.avg_ndvi,
          name: d.reserve_name,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [d.centroid_lng, d.centroid_lat],
        },
      }))

      map.addSource('ndvi-heat', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
      })

      map.addLayer({
        id: 'ndvi-heat',
        type: 'circle',
        source: 'ndvi-heat',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 40, 10, 80],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'ndvi'],
            0.3, '#E04444',
            0.5, '#F4B740',
            0.7, '#84CC16',
            0.85, '#16A34A',
          ],
          'circle-opacity': 0.55,
          'circle-blur': 0.6,
        },
      })
    }

    if (map.isStyleLoaded()) apply()
    else map.once('idle', apply)
  }, [layer, year, ndviData, mapReady])

  // Low canopy markers (only show on NDVI or terrain layer)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    const showLowCanopy = layer === 'ndvi' || layer === 'terrain'
    if (!showLowCanopy) return

    const markers: maplibregl.Marker[] = []
    lowCanopy.forEach((z) => {
      const el = document.createElement('div')
      el.style.cursor = 'pointer'
      const color = z.priority === 'high' ? '#F97316' : z.priority === 'medium' ? '#F4B740' : '#84CC16'
      el.innerHTML = `
        <div style="position:relative;width:18px;height:18px;">
          <div style="position:absolute;inset:0;border-radius:9999px;background:${color};opacity:0.25;transform:scale(2.2);"></div>
          <div style="position:absolute;inset:0;border-radius:9999px;background:${color};border:2px dashed white;"></div>
        </div>
      `

      const popup = new maplibregl.Popup({ offset: 18, closeButton: false }).setHTML(`
        <div style="font-family:system-ui;padding:4px 6px;">
          <div style="font-size:10px;font-family:monospace;color:#999;letter-spacing:1px;margin-bottom:2px;">REFOREST CANDIDATE</div>
          <div style="font-weight:700;font-size:13px;margin-bottom:2px;">${z.name}</div>
          <div style="font-size:11px;color:#666;">${z.county} • ${z.current_cover_percent}% cover</div>
          <div style="font-size:11px;color:${color};font-weight:600;margin-top:4px;text-transform:uppercase;">${z.priority} PRIORITY</div>
        </div>
      `)

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([z.longitude, z.latitude])
        .setPopup(popup)
        .addTo(map)
      markers.push(marker)
    })

    return () => markers.forEach((m) => m.remove())
  }, [lowCanopy, layer, mapReady])

  function addBaseOverlays(map: MLMap) {
    if (!map.getSource('counties')) {
      map.addSource('counties', { type: 'geojson', data: '/data/kenya-counties.geojson' })
      map.addLayer({
        id: 'counties-fill',
        type: 'fill',
        source: 'counties',
        paint: { 'fill-color': '#16A34A', 'fill-opacity': 0.04 },
      })
      map.addLayer({
        id: 'counties-line',
        type: 'line',
        source: 'counties',
        paint: { 'line-color': '#16A34A', 'line-width': 1, 'line-opacity': 0.5 },
      })
    }
    if (!map.getSource('reserves')) {
      map.addSource('reserves', { type: 'geojson', data: '/data/kenya-reserves.geojson' })
      map.addLayer({
        id: 'reserves-fill',
        type: 'fill',
        source: 'reserves',
        paint: {
          'fill-color': layer === 'ndvi' ? '#16A34A' : '#0E5A3A',
          'fill-opacity': layer === 'ndvi' ? 0.15 : 0.25,
        },
      })
      map.addLayer({
        id: 'reserves-line',
        type: 'line',
        source: 'reserves',
        paint: { 'line-color': '#16A34A', 'line-width': 2, 'line-dasharray': [2, 2] },
      })
      map.addLayer({
        id: 'reserves-labels',
        type: 'symbol',
        source: 'reserves',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-offset': [0, 0.5],
        },
        paint: {
          'text-color': '#F5F4EE',
          'text-halo-color': '#0A0F0D',
          'text-halo-width': 1.5,
        },
      })
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%', minHeight: '500px', background: '#0A0F0D' }}
      />

      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-mono max-w-md text-center">
          ⚠️ {error}
        </div>
      )}

      {!mapReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center">
            <div className="inline-block h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-mono text-muted-foreground">INITIALIZING SATELLITE FEED...</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-card/90 backdrop-blur-md border-t flex items-center justify-between px-4 text-xs font-mono text-muted-foreground z-10">
        <div className="flex gap-4">
          <span>LAT: {coords.lat.toFixed(6)}</span>
          <span>LNG: {coords.lng.toFixed(6)}</span>
          <span className="hidden md:inline">IMAGERY: {year} {year === 2026 ? '• LIVE' : '• ARCHIVE'}</span>
        </div>
        <div className="hidden sm:flex gap-4">
          <span className="text-primary">● {layer.toUpperCase()}</span>
          <span>POWERED BY MAPTILER + SENTINEL-2</span>
        </div>
      </div>
    </>
  )
} 