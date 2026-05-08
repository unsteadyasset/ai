import { TopBar } from '@/components/top-bar'
import { Card } from '@/components/ui/card'
import { Satellite, Brain, MapPin, Shield, Zap, TreePine } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar variant="public" />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-primary/15 items-center justify-center mb-4">
            <Satellite className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            AI Powered Land Surveillance System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A science project demonstrating how artificial intelligence and satellite
            imagery can revolutionize forest conservation in Kenya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            {
              icon: Satellite,
              title: 'Sentinel-2 Satellite Data',
              desc: 'Free European Space Agency imagery, captured every 5 days at 10m resolution.',
            },
            {
              icon: Brain,
              title: 'NDVI Analysis',
              desc: 'Normalized Difference Vegetation Index measures forest health from satellite bands.',
            },
            {
              icon: Zap,
              title: 'Groq AI (Llama 3.3)',
              desc: 'Ultra-fast LLM analyzes threats, predicts causes, and recommends ranger actions.',
            },
            {
              icon: MapPin,
              title: 'Geospatial Threat Detection',
              desc: 'AI identifies deforestation, fires, and encroachment by comparing time-series imagery.',
            },
            {
              icon: Shield,
              title: 'Ranger Dispatch System',
              desc: 'KFS rangers receive prioritized alerts with coordinates, AI briefings, and directions.',
            },
            {
              icon: TreePine,
              title: 'Public Engagement',
              desc: 'Citizens report incidents anonymously with photos. Real-time integration with rangers.',
            },
          ].map((item) => (
            <Card key={item.title} className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-br from-primary/5 to-emerald-500/5 border-primary/20">
          <h2 className="text-2xl font-bold mb-3">The Problem</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Kenya loses approximately 12,000 hectares of forest annually to illegal logging,
            encroachment, and fires. KFS rangers patrol vast areas with limited resources,
            often arriving after irreversible damage. Traditional monitoring is reactive,
            slow, and incomplete.
          </p>

          <h2 className="text-2xl font-bold mb-3">Our Solution</h2>
          <p className="text-muted-foreground leading-relaxed">
            By combining free satellite imagery with AI analysis, we provide rangers with
            real-time threat detection, predictive cause analysis, and tactical dispatch
            recommendations. Public participation amplifies coverage. The result: faster
            response, smarter resource allocation, and measurable forest protection.
          </p>
        </Card>

        <div className="text-center mt-12 text-sm text-muted-foreground font-mono">
          <p>BUILT FOR THE 2026 SCIENCE INNOVATION PROJECT</p>
          <p className="mt-1">MASENO SCHOOL INNOVATION CLUB</p>
        </div>
      </main>
    </div>
  )
}