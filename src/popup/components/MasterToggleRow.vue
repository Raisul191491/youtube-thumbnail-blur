<script setup lang="ts">
import ToggleSwitch from './ToggleSwitch.vue'

defineProps<{ scheduleEnabled: boolean }>()
const on = defineModel<boolean>({ required: true })
</script>

<template>
  <div
    class="mx-4 flex items-center justify-between rounded-popup border border-popup-border bg-popup-surface px-4 py-3"
  >
    <div>
      <div class="text-[13px] font-medium text-popup-text">
        {{ on ? 'Blur is on' : 'Blur is off' }}
      </div>
      <div class="mt-0.5 text-[11px] text-popup-muted">
        {{
          scheduleEnabled
            ? 'Following schedule — toggle to override'
            : on
              ? 'All thumbnails obscured'
              : 'Thumbnails visible'
        }}
      </div>
    </div>
    <ToggleSwitch v-model="on" />
  </div>
</template>
