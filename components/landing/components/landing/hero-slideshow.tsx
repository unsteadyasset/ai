'use client'

import { useEffect, useState } from 'react'
import { LANDING_IMAGES } from '@/lib/landing-images'

interface Props {
  intervalMs?: number
  className?: string
  overlay?: boolean
}

export function HeroSlideshow({ intervalMs = 2500, className = '', overlay = true }: Props) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % LANDING_IMAGES.length)
    }, intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {LANDING_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-all duration-1000 ease-out"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === idx ? 1 : 0,
            transform:
              i === idx
                ? 'scale(1.05) translateX(0)'
                : 'scale(1) translateX(30px)',
          }}
        />
      ))}
      {overlay && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </>
      )}
    </div>
  )
}