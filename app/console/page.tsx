import { MapView } from '@/components/console/map-view'
import { LensPills } from '@/components/console/lens-pills'
import { LayerPicker } from '@/components/console/layer-picker'
import { TemporalSlider } from '@/components/console/temporal-slider'
import { StatusBar } from '@/components/console/status-bar'
import { ConsoleTopBar } from '@/components/console/console-topbar'

export default function ConsolePage() {
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-background">
      <MapView />
      <ConsoleTopBar />
      <LensPills />
      <LayerPicker />
      <TemporalSlider />
      <StatusBar />
    </div>
  )
}