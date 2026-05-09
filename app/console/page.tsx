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
    <div
      className="flex flex-col"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <TopBar variant="console" />
      <div
        style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          overflow: 'hidden',
        }}
      >
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
