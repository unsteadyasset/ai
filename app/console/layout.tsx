'use client'

import { useEffect } from 'react'

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  return <>{children}</>
}