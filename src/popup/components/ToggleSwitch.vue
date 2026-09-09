<script setup lang="ts">
const on = defineModel<boolean>({ required: true })
</script>

<template>
  <button
    role="switch"
    :aria-checked="on"
    class="relative inline-block h-5.5 w-9.5 shrink-0 rounded-full transition-colors"
    :class="on ? 'bg-accent' : 'bg-white/15'"
    @click="on = !on"
  >
    <span
      class="absolute top-0.5 h-4.5 w-4.5 rounded-full transition-all"
      :class="on ? 'left-4.5 bg-popup-bg' : 'left-0.5 bg-popup-muted'"
    />
  </button>
</template>
