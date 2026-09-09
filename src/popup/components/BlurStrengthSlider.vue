<script setup lang="ts">
const strength = defineModel<number>({ required: true })
</script>

<template>
  <div class="mx-4 mt-4">
    <div class="mb-1.5 flex items-center justify-between">
      <span class="text-[12px] font-medium text-popup-text">Blur strength</span>
      <span class="text-[11px] tabular-nums text-popup-muted">{{ strength }}px</span>
    </div>
    <input
      v-model.number="strength"
      type="range"
      min="4"
      max="40"
      step="1"
      class="w-full accent-accent"
    />
  </div>
</template>
