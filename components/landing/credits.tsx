'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Code2 } from 'lucide-react'

export function Credits() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative py-16 px-4 border-t bg-gradient-to-b from-background via-[#006B3F]/5 to-background"
    >
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <div className="h-1 w-8 bg-black rounded-full" />
          <div className="h-1 w-8 bg-[#BB0000] rounded-full" />
          <div className="h-1 w-8 bg-[#006B3F] rounded-full" />
          <div className="h-1 w-8 bg-foreground rounded-full" />
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest text-muted-foreground">
          <GraduationCap className="h-3 w-3" />
          MASENO SCHOOL INNOVATION CLUB · 2026
        </div>

        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
          Built by Ryan Atuti & Alphone Ogechi
        </h3>
        <p className="text-sm text-muted-foreground">
          Form 4 Cream · 2026 · For the Republic of Kenya 🇰🇪
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-foreground/5 border">
            Sentinel-2
          </span>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-foreground/5 border">
            Groq Llama 3.3
          </span>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-foreground/5 border">
            Supabase
          </span>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-foreground/5 border">
            MapTiler
          </span>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-foreground/5 border">
            Next.js 16
          </span>
        </div>

        <div className="pt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Code2 className="h-3 w-3" />
          <span>Designed with ❤️ for Kenya's forests</span>
        </div>
      </div>
    </motion.section>
  )
}   