<script setup lang="ts">
import type { SurfaceKey } from '../../utils/storage'

const surfaces = defineModel<Record<SurfaceKey, boolean>>({ required: true })

const SURFACES: { key: SurfaceKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Home feed', icon: '🏠' },
  { key: 'search', label: 'Search', icon: '🔍' },
  { key: 'watch', label: 'Watch page', icon: '▶️' },
  { key: 'shorts', label: 'Shorts', icon: '📱' },
  { key: 'channels', label: 'Channels', icon: '📺' },
  { key: 'notifications', label: 'Notifications', icon: '🔔' },
]
</script>

<template>
  <div class="mx-4 mt-4">
    <div class="mb-1.5 text-[10.5px] font-medium tracking-[0.08em] text-popup-faint">
      SURFACES
    </div>
    <div class="grid grid-cols-2 gap-1.5">
      <label
        v-for="s in SURFACES"
        :key="s.key"
        class="flex cursor-pointer items-center gap-2 rounded-lg border border-popup-border bg-popup-surface px-2.5 py-2 transition-colors hover:border-white/15"
      >
        <span class="text-[12px]">{{ s.icon }}</span>
        <span
          class="flex-1 text-[11.5px]"
          :class="surfaces[s.key] ? 'text-popup-text' : 'text-popup-faint'"
          >{{ s.label }}</span
        >
        <input
          v-model="surfaces[s.key]"
          type="checkbox"
          class="h-3.5 w-3.5 accent-accent"
        />
      </label>
    </div>
  </div>
</template>
