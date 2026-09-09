<script setup lang="ts">
import { computed } from 'vue'
import type { BlurStyle } from '../../utils/storage'

const props = defineProps<{ strength: number; blurStyle: BlurStyle }>()

// Preview swatches are scaled-down thumbnails; scale the blur to match so
// the preview stays honest about what the number means on YouTube.
const filter = computed(() =>
  props.blurStyle === 'solid'
    ? 'contrast(0%) brightness(0.35)'
    : `blur(${Math.max(1, props.strength * 0.45)}px)`,
)

const GRADIENTS = [
  'linear-gradient(135deg, #f97362 0%, #8a4fd0 100%)',
  'linear-gradient(135deg, #4fc3f7 0%, #2e7d32 100%)',
  'linear-gradient(135deg, #ffd54f 0%, #e91e63 100%)',
]
</script>

<template>
  <div class="mx-4 mt-3">
    <div class="mb-1.5 text-[10.5px] font-medium tracking-[0.08em] text-popup-faint">
      PREVIEW
    </div>
    <div class="flex gap-2 overflow-hidden rounded-popup">
      <div
        v-for="(g, i) in GRADIENTS"
        :key="i"
        class="h-14 flex-1 rounded-lg"
        :style="{ background: g, filter }"
      />
    </div>
  </div>
</template>
