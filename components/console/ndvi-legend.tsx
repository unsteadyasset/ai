'use client'

import { useConsoleStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers } from 'lucide-react'

export function NdviLegend() {
  const { layer } = useConsoleStore()

  return (
    <AnimatePresence>
      {layer === 'ndvi' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-20 right-4 z-20 w-48 bg-card/90 backdrop-blur-md border rounded-xl p-3 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-3 w-3 text-primary" />
            <p className="text-[10px] font-mono tracking-wider text-muted-foreground">
              NDVI INDEX
            </p>
          </div>
          <div
            className="h-2 rounded-full mb-1.5"
            style={{
              background:
                'linear-gradient(to right, #E04444 0%, #F4B740 35%, #84CC16 70%, #16A34A 100%)',
            }}
          />
          <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
            <span>0.3</span>
            <span>0.5</span>
            <span>0.7</span>
            <span>0.85</span>
          </div>
          <div className="flex justify-between text-[9px] mt-0.5">
            <span className="text-destructive">DEGRADED</span>
            <span className="text-primary">HEALTHY</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}