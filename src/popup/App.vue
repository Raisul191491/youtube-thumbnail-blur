<script setup lang="ts">
import { useSettings } from './composables/useSettings'
import PopupHeader from './components/PopupHeader.vue'
import MasterToggleRow from './components/MasterToggleRow.vue'
import LivePreviewStrip from './components/LivePreviewStrip.vue'
import BlurStrengthSlider from './components/BlurStrengthSlider.vue'
import SegmentControl from './components/SegmentControl.vue'
import SurfaceToggleGrid from './components/SurfaceToggleGrid.vue'
import StatsFooter from './components/StatsFooter.vue'
import type { BlurStyle, RevealMode } from '../utils/storage'

const { settings } = useSettings()

const REVEAL_OPTIONS: { value: RevealMode; label: string }[] = [
  { value: 'hover', label: 'Hover' },
  { value: 'click', label: 'Click' },
  { value: 'never', label: 'Never' },
]

const STYLE_OPTIONS: { value: BlurStyle; label: string }[] = [
  { value: 'blur', label: 'Blur' },
  { value: 'solid', label: 'Solid' },
]
</script>

<template>
  <div class="w-[336px] bg-popup-bg pb-0 text-popup-text antialiased">
    <PopupHeader />
    <MasterToggleRow
      v-model="settings.masterEnabled"
      :schedule-enabled="settings.schedule.enabled"
    />
    <div :class="{ 'pointer-events-none opacity-40': !settings.masterEnabled }">
      <LivePreviewStrip
        :strength="settings.blurStrengthPx"
        :blur-style="settings.blurStyle"
      />
      <BlurStrengthSlider v-model="settings.blurStrengthPx" />
      <SegmentControl
        v-model="settings.blurStyle"
        label="Style"
        :options="STYLE_OPTIONS"
      />
      <SegmentControl
        v-model="settings.revealMode"
        label="Reveal"
        :options="REVEAL_OPTIONS"
      />
      <SurfaceToggleGrid v-model="settings.surfaces" />
    </div>
    <StatsFooter />
  </div>
</template>
