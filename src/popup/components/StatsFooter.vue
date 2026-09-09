<script setup lang="ts">
import { useStats } from '../composables/useStats'

const { today, week } = useStats()

function openOptions() {
  chrome.runtime.openOptionsPage()
}
</script>

<template>
  <footer
    class="mt-4 flex items-center justify-between border-t border-popup-border px-5 py-3"
  >
    <span class="text-[11px] text-popup-muted">
      {{ today.toLocaleString() }} blurred today · {{ week.toLocaleString() }} this week
    </span>
    <button
      class="text-[11px] font-medium text-accent transition-colors hover:text-accent-dim"
      @click="openOptions"
    >
      Advanced
    </button>
  </footer>
</template>
