import { TopBar } from '@/components/top-bar'
import { HeroStats } from '@/components/dashboard/hero-stats'
import { Leaderboard } from '@/components/dashboard/leaderboard'
import { AlertsFeed } from '@/components/dashboard/alerts-feed'
import { NewsFeed } from '@/components/dashboard/news-feed'
import { ReportForm } from '@/components/dashboard/report-form'
import { Chatbot } from '@/components/dashboard/chatbot'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar variant="public" />

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6 max-w-7xl">
                {/* Hero */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-muted-foreground">
              LIVE NATIONAL OVERVIEW • SENTINEL-2 FEED ACTIVE
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Kenya Forest Intelligence
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base">
            Real-time satellite-powered monitoring of forest cover, AI-detected threats,
            and conservation efforts across all 47 counties. Powered by NDVI analysis
            and deep learning.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
              SENTINEL-2 IMAGERY
            </span>
            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
              NDVI ANALYSIS
            </span>
            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
              GROQ AI INTELLIGENCE
            </span>
            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/30">
              REAL-TIME ALERTS
            </span>
          </div>
        </section>

        {/* Stats */}
        <HeroStats />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Leaderboard />
          <AlertsFeed />
          <NewsFeed />
        </div>

        {/* Report */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ReportForm />
          <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-card to-emerald-500/5 p-6 flex flex-col justify-center">
            <h3 className="text-lg font-bold mb-2">Help Protect Kenya's Forests</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your reports power our AI. Every submission is reviewed by KWS rangers.
              Anonymous reporting protects you. Photos help us verify faster.
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">1,247</p>
                <p className="text-[10px] font-mono text-muted-foreground uppercase">
                  Reports Verified
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">89</p>
                <p className="text-[10px] font-mono text-muted-foreground uppercase">
                  Arrests Made
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">340Ha</p>
                <p className="text-[10px] font-mono text-muted-foreground uppercase">
                  Forest Saved
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="pt-8 pb-4 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted-foreground font-mono">
            <span>POWERED BY SENTINEL-2 • NDVI ANALYSIS • GROQ AI</span>
            <span>© KENYA FOREST SERVICE • 2026</span>
          </div>
        </footer>
      </main>

      <Chatbot context="public" />
    </div>
  )
}