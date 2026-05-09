'use client'

import { motion } from 'framer-motion'
import { HeroSlideshow } from './hero-slideshow'
import { Sprout } from 'lucide-react'

export function Vision2032() {
  return (
    <section className="relative py-24 px-4 overflow-hidden border-t">
      <div className="absolute inset-0 opacity-30">
        <HeroSlideshow intervalMs={4000} overlay={false} />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex h-14 w-14 rounded-2xl bg-[#006B3F]/15 items-center justify-center mb-6">
            <Sprout className="h-7 w-7 text-[#006B3F]" />
          </div>

          <p className="text-[10px] font-mono tracking-widest text-muted-foreground mb-3">
            VISION 2032
          </p>

          <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-4">
            <span className="text-[#006B3F]">15 Billion</span> Trees
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            President Ruto's vision. Our technology. Kenya's future.
            Together, we restore <strong>30% national forest cover</strong> by 2032.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#006B3F]">850M</p>
              <p className="text-[10px] font-mono text-muted-foreground tracking-wider mt-1">
                PLANTED SO FAR
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#BB0000]">12K Ha</p>
              <p className="text-[10px] font-mono text-muted-foreground tracking-wider mt-1">
                LOST PER YEAR
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">2032</p>
              <p className="text-[10px] font-mono text-muted-foreground tracking-wider mt-1">
                TARGET YEAR
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}