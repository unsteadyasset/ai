'use client'

import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hover, setHover] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (window.matchMedia('(pointer: coarse)').matches) return // skip on touch

    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    const enter = () => setHover(true)
    const leave = () => setHover(false)

    window.addEventListener('mousemove', move)
    document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
    })

    return () => {
      window.removeEventListener('mousemove', move)
    }
  }, [mounted])

  if (!mounted) return null
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)
    return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: hover ? 18 : 8,
        height: hover ? 18 : 8,
        background: hover ? 'rgba(22,163,74,0.85)' : '#16A34A',
        borderRadius: '9999px',
        pointerEvents: 'none',
        transform: `translate(${pos.x - (hover ? 9 : 4)}px, ${pos.y - (hover ? 9 : 4)}px)`,
        transition: 'width 0.2s, height 0.2s, background 0.2s',
        zIndex: 99999,
        mixBlendMode: 'difference',
      }}
    />
  )
}