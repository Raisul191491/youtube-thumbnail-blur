/**
 * Single source of truth for settings in popup/options UIs.
 * Reactive object, debounced write-back, stays correct if settings change
 * elsewhere (keyboard shortcut, schedule alarm) via storage.onChanged.
 *
 * The `lastSynced` snapshot guards against the write→onChanged→write echo
 * loop: normalize() produces new nested object references on every remote
 * update, which re-triggers the deep watcher even when nothing actually
 * changed — comparing serialized content (not references) breaks the cycle.
 */

import { onUnmounted, reactive, watch } from 'vue'
import {
  DEFAULT_SETTINGS,
  getSettings,
  saveSettings,
  onSettingsChanged,
  type Settings,
} from '../../utils/storage'

const WRITE_DEBOUNCE_MS = 500

export function useSettings() {
  const settings = reactive<Settings>(structuredClone(DEFAULT_SETTINGS))
  let loaded = false
  let lastSynced = ''
  let writeTimer: ReturnType<typeof setTimeout> | null = null

  function applyRemote(s: Settings) {
    lastSynced = JSON.stringify(s)
    Object.assign(settings, s)
  }

  void getSettings().then((s) => {
    applyRemote(s)
    loaded = true
  })

  const unsubscribe = onSettingsChanged(applyRemote)

  function persist(serialized: string) {
    lastSynced = serialized
    saveSettings(JSON.parse(serialized)).catch((e) => {
      // sync quota errors etc. — keep the popup alive, log for debugging
      console.warn('[ytb] settings write failed:', e)
    })
  }

  watch(
    settings,
    () => {
      if (!loaded) return
      const serialized = JSON.stringify(settings)
      if (serialized === lastSynced) return
      if (writeTimer) clearTimeout(writeTimer)
      writeTimer = setTimeout(() => {
        writeTimer = null
        persist(JSON.stringify(settings))
      }, WRITE_DEBOUNCE_MS)
    },
    { deep: true },
  )

  onUnmounted(() => {
    unsubscribe()
    // Flush a pending write so a fast popup close doesn't drop the change.
    if (writeTimer) {
      clearTimeout(writeTimer)
      persist(JSON.stringify(settings))
    }
  })

  return { settings }
}
