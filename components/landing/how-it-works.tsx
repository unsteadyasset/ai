'use client'

import { motion } from 'framer-motion'
import { Satellite, Brain, Send } from 'lucide-react'

const STEPS = [
  {
    icon: Satellite,
    label: 'DETECT',
    title: 'Satellites scan Kenya every 5 days',
    desc: 'Free Sentinel-2 imagery captures every hectare at 10-meter resolution.',
    color: '#000000',
  },
  {
    icon: Brain,
    label: 'ANALYZE',
    title: 'AI identifies threats & predicts causes',
    desc: 'NDVI deviation + Groq Llama 3.3 flags fires, logging, and encroachment in real-time.',
    color: '#BB0000',
  },
  {
    icon: Send,
    label: 'DISPATCH',
    title: 'Rangers receive tactical briefings',
    desc: 'Instant alerts with coordinates, AI recommendations, and Google Maps directions.',
    color: '#006B3F',
  },
]

export function HowItWorks() {
  return (
    <section className="relative py-20 px-4 border-t">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[10px] font-mono tracking-widest text-muted-foreground mb-2">
            HOW IT WORKS
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            From orbit to action — in minutes.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.04, y: -6 }}
              className="relative p-6 rounded-2xl border bg-card/85 backdrop-blur-md hover:shadow-2xl transition-all"
            >
              <div
                className="absolute top-4 right-4 text-[80px] font-bold opacity-5 leading-none"
                style={{ color: s.color }}
              >
                0{i + 1}
              </div>
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${s.color}15` }}
              >
                <s.icon className="h-6 w-6" style={{ color: s.color }} />
              </div>
              <p
                className="text-[10px] font-mono tracking-widest mb-2"
                style={{ color: s.color }}
              >
                {s.label}
              </p>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}