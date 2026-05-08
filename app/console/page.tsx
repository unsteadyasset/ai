import { MapView } from '@/components/console/map-view'
import { LensPicker } from '@/components/console/lens-picker'
import { SideControls } from '@/components/console/side-controls'
import { ThreatModal } from '@/components/console/threat-modal'
import { TemporalSlider } from '@/components/console/temporal-slider'
import { NdviLegend } from '@/components/console/ndvi-legend'
import { ConsoleStats } from '@/components/console/console-stats'
import { Chatbot } from '@/components/dashboard/chatbot'
import { TopBar } from '@/components/top-bar'

export default function ConsolePage() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden fixed inset-0">
      <TopBar variant="console" />
      <div className="flex-1 relative w-full" style={{ height: 'calc(100vh - 56px)' }}>
        <MapView />
        <LensPicker />
        <SideControls />
        <ConsoleStats />
        <NdviLegend />
        <TemporalSlider />
        <ThreatModal />
        <Chatbot context="ranger" />
      </div>
    </div>
  )
}