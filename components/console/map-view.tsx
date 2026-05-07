'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useConsoleStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'

const MAP_STYLES = {
  satellite: `https://api.maptiler.com/maps/hybrid/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
  ndvi: `https://api.maptiler.com/maps/satellite/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
  terrain: `https://api.maptiler.com/maps/topo-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
}

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  
  const {
    mapLayer,
    showCounties,
    showForests,
    threats,
    setThreats,
    setSelectedThreat,
    setCursor,
  } = useConsoleStore()

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLES.satellite,
      center: [37.9062, -0.0236], // Kenya center
      zoom: 6,
      pitch: 0,
      attributionControl: false,
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right')
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-right')

    map.on('mousemove', (e) => {
      setCursor({ lat: e.lngLat.lat, lng: e.lngLat.lng })
    })

    map.on('load', async () => {
      // Load counties
      try {
        const res = await fetch('/data/kenya-counties.geojson')
        const counties = await res.json()
        
        map.addSource('counties', { type: 'geojson', data: counties })
        map.addLayer({
          id: 'counties-fill',
          type: 'fill',
          source: 'counties',
          paint: {
            'fill-color': '#16A34A',
            'fill-opacity': 0.05,
          },
        })
        map.addLayer({
          id: 'counties-line',
          type: 'line',
          source: 'counties',
          paint: {
            'line-color': '#16A34A',
            'line-width': 1,
            'line-opacity': 0.4,
            'line-dasharray': [2, 2],
          },
        })
      } catch (err) {
        console.error('Counties load failed:', err)
      }

      // Load forest reserves
      try {
        const res = await fetch('/data/kenya-forests.geojson')
        const forests = await res.json()
        
        map.addSource('forests', { type: 'geojson', data: forests })
        map.addLayer({
          id: 'forests-fill',
          type: 'fill',
          source: 'forests',
          paint: {
            'fill-color': '#0E5A3A',
            'fill-opacity': 0.25,
          },
        })
        map.addLayer({
          id: 'forests-line',
          type: 'line',
          source: 'forests',
          paint: {
            'line-color': '#16A34A',
            'line-width': 2,
          },
        })
        map.addLayer({
          id: 'forests-label',
          type: 'symbol',
          source: 'forests',
          layout: {
            'text-field': ['get', 'name'],
            'text-size': 11,
            'text-font': ['Open Sans Bold'],
            'text-transform': 'uppercase',
            'text-letter-spacing': 0.1,
          },
          paint: {
            'text-color': '#16A34A',
            'text-halo-color': '#0A0F0D',
            'text-halo-width': 2,
          },
        })
      } catch (err) {
        console.error('Forests load failed:', err)
      }

      mapRef.current = map
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Layer style switching
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.setStyle(MAP_STYLES[mapLayer])
    // Re-add custom layers after style change
    map.once('styledata', () => {
      // Reload data after style swap
      reloadCustomLayers(map)
    })
  }, [mapLayer])

  async function reloadCustomLayers(map: maplibregl.Map) {
    try {
      if (!map.getSource('counties')) {
        const counties = await fetch('/data/kenya-counties.geojson').then((r) => r.json())
        map.addSource('counties', { type: 'geojson', data: counties })
        map.addLayer({
          id: 'counties-fill', type: 'fill', source: 'counties',
          paint: { 'fill-color': '#16A34A', 'fill-opacity': 0.05 },
        })
        map.addLayer({
          id: 'counties-line', type: 'line', source: 'counties',
          paint: { 'line-color': '#16A34A', 'line-width': 1, 'line-opacity': 0.4, 'line-dasharray': [2, 2] },
        })
      }
      if (!map.getSource('forests')) {
        const forests = await fetch('/data/kenya-forests.geojson').then((r) => r.json())
        map.addSource('forests', { type: 'geojson', data: forests })
        map.addLayer({
          id: 'forests-fill', type: 'fill', source: 'forests',
          paint: { 'fill-color': '#0E5A3A', 'fill-opacity': 0.25 },
        })
        map.addLayer({
          id: 'forests-line', type: 'line', source: 'forests',
          paint: { 'line-color': '#16A34A', 'line-width': 2 },
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Toggle counties
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.getLayer('counties-fill')) return
    const visibility = showCounties ? 'visible' : 'none'
    map.setLayoutProperty('counties-fill', 'visibility', visibility)
    map.setLayoutProperty('counties-line', 'visibility', visibility)
  }, [showCounties])

  // Toggle forests
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.getLayer('forests-fill')) return
    const visibility = showForests ? 'visible' : 'none'
    map.setLayoutProperty('forests-fill', 'visibility', visibility)
    map.setLayoutProperty('forests-line', 'visibility', visibility)
    if (map.getLayer('forests-label'))
      map.setLayoutProperty('forests-label', 'visibility', visibility)
  }, [showForests])

  // Load threats
  useEffect(() => {
    async function loadThreats() {
      const supabase = createClient()
      const { data } = await supabase
        .from('threats')
        .select('*')
        .in('status', ['active', 'dispatched'])
      if (data) setThreats(data as any)
    }
    loadThreats()
  }, [setThreats])

  // Render threat markers
  useEffect(() => {
    const map = mapRef.current
    if (!map || threats.length === 0) return

    const markers: maplibregl.Marker[] = []

    threats.forEach((threat) => {
      const el = document.createElement('div')
      el.className = 'cursor-pointer relative'
      
      const color =
        threat.severity === 'critical' ? '#E04444'
        : threat.severity === 'high' ? '#F97316'
        : threat.severity === 'medium' ? '#F4B740'
        : threat.type === 'growth' ? '#16A34A' : '#F4B740'

      el.innerHTML = `
        <div class="relative flex items-center justify-center" style="width: 28px; height: 28px;">
          <div class="absolute inset-0 rounded-full threat-ring" style="background: ${color}; opacity: 0.4;"></div>
          <div class="relative h-3 w-3 rounded-full threat-pulse" style="background: ${color}; box-shadow: 0 0 12px ${color};"></div>
        </div>
      `

      el.addEventListener('click', (e) => {
        e.stopPropagation()
        setSelectedThreat(threat)
        map.flyTo({ center: [threat.longitude, threat.latitude], zoom: 12, duration: 1500 })
      })

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([threat.longitude, threat.latitude])
        .addTo(map)

      markers.push(marker)
    })

    return () => markers.forEach((m) => m.remove())
  }, [threats, setSelectedThreat])

  return <div ref={containerRef} className="absolute inset-0" />
}