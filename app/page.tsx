'use client'

import { motion } from 'framer-motion'
import { ChevronDown, AlertTriangle, Satellite } from 'lucide-react'
import { TopBar } from '@/components/top-bar'
import { Button } from '@/components/ui/button'
import { HeroSlideshow } from '@/components/landing/hero-slideshow'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Vision2032 } from '@/components/landing/vision-2032'
import { Credits } from '@/components/landing/credits'
import { HeroStats } from '@/components/dashboard/hero-stats'
import { Leaderboard } from '@/components/dashboard/leaderboard'
import { AlertsFeed } from '@/components/dashboard/alerts-feed'
import { NewsFeed } from '@/components/dashboard/news-feed'
import { ReportForm } from '@/components/dashboard/report-form'
import { Chatbot } from '@/components/dashboard/chatbot'

export default function HomePage() {
  function scrollToReport() {
    document.getElementById('report-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function scrollToDash() {
    document.getElementById('dashboard-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar variant="public" />

      {/* HERO */}
      <section className="relative h-[calc(100vh-3.5rem)] overflow-hidden">
        <HeroSlideshow intervalMs={2500} />

        {/* Kenya flag accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 z-20 flex">
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#BB0000]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#006B3F]" />
        </div>

        {/* Center content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
          >
            <Satellite className="h-3 w-3 text-[#006B3F]" />
            <span className="text-[8px] font-mono tracking-widest">
              🇰🇪 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter max-w-5xl leading-[0.95]"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
          >
            AI Powered Land Surveillance System.<br />
            <span className="text-[#16A34A]"></span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base md:text-xl text-white/90 max-w-2xl mt-6 font-light"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
          >
            Kenya's forests, secured by AI.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 mt-10"
          >
            <Button
              onClick={scrollToReport}
              size="lg"
              className="gap-2 bg-[#BB0000] hover:bg-[#9A0000] text-white shadow-2xl hover:shadow-[#BB0000]/40 transition-all hover:scale-105"
            >
              <AlertTriangle className="h-4 w-4" />
              Report an Incident
            </Button>
            <Button
              onClick={scrollToDash}
              size="lg"
              variant="outline"
              className="gap-2 bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white transition-all hover:scale-105"
            >
              View Live Dashboard
            </Button>
          </motion.div>
        </div>

        {/* Bottom stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="absolute bottom-6 left-0 right-0 z-10 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <HeroStats compact />
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="h-5 w-5 text-white/60 animate-bounce" />
        </motion.div>
      </section>

      {/* DASHBOARD */}
      <main id="dashboard-section" className="flex-1 container mx-auto px-4 py-12 space-y-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-2"
        >
          <p className="text-[10px] font-mono tracking-widest text-muted-foreground mb-2">
            LIVE NATIONAL OVERVIEW
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Kenya Forest Intelligence
          </h2>
        </motion.div>

        <HeroStats />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          <Leaderboard />
          <AlertsFeed />
          <NewsFeed />
        </motion.div>
      </main>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* VISION 2032 */}
      <Vision2032 />

      {/* REPORT INCIDENT */}
      <section
        id="report-section"
        className="relative py-20 px-4 border-t bg-gradient-to-b from-background to-[#006B3F]/5"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-[10px] font-mono tracking-widest text-[#BB0000] mb-2">
              CITIZEN ACTION
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
              Report an Incident
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Witnessed illegal logging, a fire, or encroachment? Submit anonymously.
              Photos help rangers verify and respond faster.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <ReportForm />
            <div className="rounded-2xl border bg-gradient-to-br from-[#006B3F]/5 via-card to-[#BB0000]/5 p-8 flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-3">Your Report Powers Our AI</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Every submission is reviewed by KFS rangers in real-time. Anonymous
                reporting protects you. Photos accelerate verification. Together, we
                are restoring Kenya's natural heritage — one tree at a time.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <p className="text-2xl font-bold text-[#006B3F]">1,247</p>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase mt-1">
                    Reports Verified
                  </p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <p className="text-2xl font-bold text-[#BB0000]">89</p>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase mt-1">
                    Arrests Made
                  </p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <p className="text-2xl font-bold text-foreground">340Ha</p>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase mt-1">
                    Forest Saved
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CREDITS */}
      <Credits />

      <Chatbot context="public" />
    </div>
  )
}