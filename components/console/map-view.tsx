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

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#E04444',
  high: '#F97316',
  medium: '#F4B740',
  low: '#16A34A',
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

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPTILER_KEY) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLES[layer],
      center: [37.9062, -0.0236],
      zoom: 6,
      attributionControl: false,
      pixelRatio: window.devicePixelRatio || 1,
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.addControl(
      new maplibregl.ScaleControl({ maxWidth: 120, unit: 'metric' }),
      'bottom-right'
    )
    map.on('mousemove', (e) =>
      setCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng })
    )
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

  // Toggle visibility
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

  // THREAT MARKERS — native WebGL circle layer (truly geo-anchored)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    const apply = () => {
      // Cleanup previous
      ;['threats-pulse', 'threats-core', 'threats-hit'].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id)
      })
      if (map.getSource('threats-src')) map.removeSource('threats-src')

      if (threats.length === 0) return

      const isLive = year === 2026
      const visible = isLive
        ? threats
        : threats.filter((t) => new Date(t.detected_at).getFullYear() === year)

      const features = visible.map((t) => ({
        type: 'Feature' as const,
        properties: {
          id: t.id,
          severity: t.severity,
          color: SEVERITY_COLORS[t.severity] || '#16A34A',
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [t.longitude, t.latitude],
        },
      }))

      map.addSource('threats-src', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
      })

      // Outer pulsing ring
      map.addLayer({
        id: 'threats-pulse',
        type: 'circle',
        source: 'threats-src',
        paint: {
          'circle-radius': 18,
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.25,
          'circle-blur': 0.3,
        },
      })

      // Solid core marker
      map.addLayer({
        id: 'threats-core',
        type: 'circle',
        source: 'threats-src',
        paint: {
          'circle-radius': 8,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
        },
      })

      // Invisible hit area for easier clicking
      map.addLayer({
        id: 'threats-hit',
        type: 'circle',
        source: 'threats-src',
        paint: {
          'circle-radius': 20,
          'circle-color': '#000000',
          'circle-opacity': 0,
        },
      })

      // Click handler
      map.on('click', 'threats-hit', (e) => {
        const f = e.features?.[0]
        if (!f) return
        const id = f.properties?.id as string
        const coords = (f.geometry as any).coordinates as [number, number]
        setSelectedThreat(id)
        map.flyTo({ center: coords, zoom: 13, duration: 1500 })
      })

      map.on('mouseenter', 'threats-hit', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'threats-hit', () => {
        map.getCanvas().style.cursor = ''
      })

      // Pulse animation - update circle radius over time
      let frame = 0
      const animate = () => {
        if (!map.getLayer('threats-pulse')) return
        frame += 1
        const pulseRadius = 18 + Math.sin(frame / 15) * 8
        map.setPaintProperty('threats-pulse', 'circle-radius', pulseRadius)
        const pulseOpacity = 0.25 + Math.sin(frame / 15) * 0.15
        map.setPaintProperty('threats-pulse', 'circle-opacity', pulseOpacity)
        requestAnimationFrame(animate)
      }
      animate()
    }

    if (map.isStyleLoaded()) apply()
    else map.once('idle', apply)
  }, [threats, mapReady, year, setSelectedThreat])

  // NDVI overlay
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    const apply = () => {
      if (map.getLayer('ndvi-heat-label')) map.removeLayer('ndvi-heat-label')
      if (map.getLayer('ndvi-heat')) map.removeLayer('ndvi-heat')
      if (map.getSource('ndvi-heat')) map.removeSource('ndvi-heat')

      if (layer !== 'ndvi' || ndviData.length === 0) return

      const yearData = ndviData.filter((d) => d.year === year)
      const features = yearData.map((d) => ({
        type: 'Feature' as const,
        properties: {
          ndvi: d.avg_ndvi,
          name: d.reserve_name,
          ndviLabel: `${(d.avg_ndvi * 100).toFixed(0)}%`,
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
          'circle-radius': [
            'interpolate',
            ['exponential', 2],
            ['zoom'],
            5, 25,
            7, 50,
            9, 100,
            12, 280,
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'ndvi'],
            0.3, '#E04444',
            0.5, '#F4B740',
            0.7, '#84CC16',
            0.85, '#16A34A',
          ],
          'circle-opacity': 0.45,
          'circle-blur': 0.4,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-opacity': 0.3,
        },
      })

      map.addLayer({
        id: 'ndvi-heat-label',
        type: 'symbol',
        source: 'ndvi-heat',
        layout: {
          'text-field': ['get', 'ndviLabel'],
          'text-size': 13,
          'text-font': ['Open Sans Bold'],
          'text-anchor': 'center',
        },
        paint: {
          'text-color': '#FFFFFF',
          'text-halo-color': '#000000',
          'text-halo-width': 1.5,
        },
      })
    }

    if (map.isStyleLoaded()) apply()
    else map.once('idle', apply)
  }, [layer, year, ndviData, mapReady])

  // LOW CANOPY MARKERS — native WebGL
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    const apply = () => {
      ;['lowcanopy-ring', 'lowcanopy-core', 'lowcanopy-hit'].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id)
      })
      if (map.getSource('lowcanopy-src')) map.removeSource('lowcanopy-src')

      const showLowCanopy = layer === 'ndvi' || layer === 'terrain'
      if (!showLowCanopy || lowCanopy.length === 0) return

      const features = lowCanopy.map((z) => ({
        type: 'Feature' as const,
        properties: {
          name: z.name,
          county: z.county,
          cover: z.current_cover_percent,
          priority: z.priority,
          color:
            z.priority === 'high'
              ? '#F97316'
              : z.priority === 'medium'
              ? '#F4B740'
              : '#84CC16',
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [z.longitude, z.latitude],
        },
      }))

      map.addSource('lowcanopy-src', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
      })

      map.addLayer({
        id: 'lowcanopy-ring',
        type: 'circle',
        source: 'lowcanopy-src',
        paint: {
          'circle-radius': 16,
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.2,
        },
      })

      map.addLayer({
        id: 'lowcanopy-core',
        type: 'circle',
        source: 'lowcanopy-src',
        paint: {
          'circle-radius': 7,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
        },
      })

      map.addLayer({
        id: 'lowcanopy-hit',
        type: 'circle',
        source: 'lowcanopy-src',
        paint: {
          'circle-radius': 18,
          'circle-color': '#000000',
          'circle-opacity': 0,
        },
      })

      // Click → popup
      map.on('click', 'lowcanopy-hit', (e) => {
        const f = e.features?.[0]
        if (!f) return
        const p = f.properties
        const coords = (f.geometry as any).coordinates as [number, number]
        new maplibregl.Popup({ offset: 12, closeButton: false })
          .setLngLat(coords)
          .setHTML(`
            <div style="font-family:system-ui;padding:4px 6px;">
              <div style="font-size:10px;font-family:monospace;color:#999;letter-spacing:1px;margin-bottom:2px;">REFOREST CANDIDATE</div>
              <div style="font-weight:700;font-size:13px;margin-bottom:2px;">${p?.name}</div>
              <div style="font-size:11px;color:#666;">${p?.county} • ${p?.cover}% cover</div>
              <div style="font-size:11px;color:${p?.color};font-weight:600;margin-top:4px;text-transform:uppercase;">${p?.priority} PRIORITY</div>
            </div>
          `)
          .addTo(map)
      })

      map.on('mouseenter', 'lowcanopy-hit', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'lowcanopy-hit', () => {
        map.getCanvas().style.cursor = ''
      })
    }

    if (map.isStyleLoaded()) apply()
    else map.once('idle', apply)
  }, [lowCanopy, layer, mapReady])

  function addBaseOverlays(map: MLMap) {
    if (!map.getSource('counties')) {
      map.addSource('counties', {
        type: 'geojson',
        data: '/data/kenya-counties.geojson',
      })
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
      map.addSource('reserves', {
        type: 'geojson',
        data: '/data/kenya-reserves.geojson',
      })
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
        style={{
          width: '100%',
          height: '100%',
          minHeight: '500px',
          background: '#0A0F0D',
        }}
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
            <p className="text-sm font-mono text-muted-foreground">
              INITIALIZING SATELLITE FEED...
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-card/90 backdrop-blur-md border-t flex items-center justify-between px-4 text-xs font-mono text-muted-foreground z-10">
        <div className="flex gap-4">
          <span>LAT: {coords.lat.toFixed(6)}</span>
          <span>LNG: {coords.lng.toFixed(6)}</span>
          <span className="hidden md:inline">
            IMAGERY: {year} {year === 2026 ? '• LIVE' : '• ARCHIVE'}
          </span>
        </div>
        <div className="hidden sm:flex gap-4">
          <span className="text-primary">● {layer.toUpperCase()}</span>
          <span>POWERED BY MAPTILER + SENTINEL-2</span>
        </div>
      </div>
    </>
  )
}