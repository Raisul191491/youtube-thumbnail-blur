<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSettings } from '../popup/composables/useSettings'

const { settings } = useSettings()
const shortcut = ref('Not set')

// --- Onboarding (first install opens ?onboarding=1) ---
const ONBOARDING_KEY = 'ytbe:onboarding-seen'
const onboardingStep = ref(0) // 0 = hidden
const ONBOARDING_STEPS = [
  {
    title: 'Thumbnails are now blurred',
    body: 'Every thumbnail on YouTube is obscured — home feed, search, Shorts, everywhere. Click the extension icon to control it.',
  },
  {
    title: 'Reveal when you choose',
    body: 'Pick a reveal mode in the popup: hover over a thumbnail, click it once, or keep them hidden entirely.',
  },
  {
    title: 'Fine-tune here',
    body: 'This page holds scheduled blurring — set a daily window and blur turns itself on and off automatically.',
  },
]

onMounted(async () => {
  const params = new URLSearchParams(location.search)
  if (params.get('onboarding') === '1') {
    const stored = await chrome.storage.local.get(ONBOARDING_KEY)
    if (!stored[ONBOARDING_KEY]) onboardingStep.value = 1
  }
  const commands = await chrome.commands.getAll()
  const cmd = commands.find((c) => c.name === 'toggle-blur')
  if (cmd?.shortcut) shortcut.value = cmd.shortcut
})

function advanceOnboarding() {
  if (onboardingStep.value >= ONBOARDING_STEPS.length) {
    onboardingStep.value = 0
    void chrome.storage.local.set({ [ONBOARDING_KEY]: true })
  } else {
    onboardingStep.value++
  }
}
</script>

<template>
  <div class="min-h-screen bg-popup-bg text-popup-text antialiased">
    <div class="mx-auto max-w-2xl px-6 py-10">
      <header class="mb-8 flex items-center gap-3">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-lg"
          >🌫️</span
        >
        <div>
          <h1 class="text-[16px] font-medium">Thumbnail Blur — Advanced</h1>
          <p class="text-[12px] text-popup-muted">
            Keyboard shortcut: <span class="text-popup-text">{{ shortcut }}</span>
            <span class="text-popup-faint">
              · change at chrome://extensions/shortcuts</span
            >
          </p>
        </div>
      </header>

      <section class="rounded-popup border border-popup-border bg-popup-surface p-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-[13px] font-medium">Scheduled blurring</h2>
            <p class="mt-1 text-[11.5px] text-popup-muted">
              Blur turns on inside the window and off outside it. A manual toggle wins
              until the next boundary.
            </p>
          </div>
          <input
            v-model="settings.schedule.enabled"
            type="checkbox"
            class="h-4 w-4 accent-accent"
          />
        </div>
        <div
          class="mt-3 flex items-center gap-3"
          :class="{ 'pointer-events-none opacity-40': !settings.schedule.enabled }"
        >
          <label class="flex items-center gap-2 text-[12px] text-popup-muted">
            From
            <input
              v-model="settings.schedule.start"
              type="time"
              class="rounded-lg border border-popup-border bg-popup-bg px-2 py-1 text-popup-text [color-scheme:dark]"
            />
          </label>
          <label class="flex items-center gap-2 text-[12px] text-popup-muted">
            to
            <input
              v-model="settings.schedule.end"
              type="time"
              class="rounded-lg border border-popup-border bg-popup-bg px-2 py-1 text-popup-text [color-scheme:dark]"
            />
          </label>
        </div>
      </section>
    </div>

    <!-- Onboarding spotlight -->
    <div
      v-if="onboardingStep > 0"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <div
        class="w-[380px] rounded-popup border border-popup-border bg-popup-surface p-6"
      >
        <div class="mb-3 flex gap-1.5">
          <span
            v-for="i in ONBOARDING_STEPS.length"
            :key="i"
            class="h-1 flex-1 rounded-full"
            :class="i <= onboardingStep ? 'bg-accent' : 'bg-white/10'"
          />
        </div>
        <h2 class="text-[15px] font-medium">
          {{ ONBOARDING_STEPS[onboardingStep - 1]?.title }}
        </h2>
        <p class="mt-2 text-[12.5px] leading-relaxed text-popup-muted">
          {{ ONBOARDING_STEPS[onboardingStep - 1]?.body }}
        </p>
        <button
          class="mt-5 w-full rounded-lg bg-accent py-2 text-[13px] font-medium text-popup-bg transition-colors hover:bg-accent-dim"
          @click="advanceOnboarding"
        >
          {{ onboardingStep === ONBOARDING_STEPS.length ? 'Done' : 'Next' }}
        </button>
      </div>
    </div>
  </div>
</template>
