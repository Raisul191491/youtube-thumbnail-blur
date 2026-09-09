<script setup lang="ts" generic="T extends string">
defineProps<{ label: string; options: { value: T; label: string }[] }>()
const selected = defineModel<T>({ required: true })
</script>

<template>
  <div class="mx-4 mt-4">
    <div class="mb-1.5 text-[12px] font-medium text-popup-text">{{ label }}</div>
    <div class="flex rounded-lg border border-popup-border bg-popup-surface p-0.5">
      <button
        v-for="opt in options"
        :key="opt.value"
        class="flex-1 rounded-md py-1.5 text-[11.5px] transition-colors"
        :class="
          selected === opt.value
            ? 'bg-accent-soft font-medium text-accent'
            : 'text-popup-muted hover:text-popup-text'
        "
        @click="selected = opt.value"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>
