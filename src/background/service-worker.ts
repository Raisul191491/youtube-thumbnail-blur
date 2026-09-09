/**
 * MV3 background service worker.
 * - Seeds defaults + opens onboarding on install.
 * - Handles the global keyboard shortcut.
 * - Drives scheduled blurring via chrome.alarms: only flips masterEnabled
 *   when a schedule boundary is crossed, so a manual toggle wins until the
 *   next boundary instead of being silently reverted.
 */

import {
  getSettings,
  onSettingsChanged,
  patchSettings,
  saveSettings,
} from '../utils/storage'

const ALARM_NAME = 'ytbe:schedule-check'
const PREV_KEY = 'ytbe:schedule-prev-in-window'

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'install') {
    await saveSettings(await getSettings())
    chrome.tabs.create({
      url: chrome.runtime.getURL('src/options/index.html?onboarding=1'),
    })
  }
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: 15 })
})

// Toolbar icon communicates on/off state: violet rings when active,
// gray variant when disabled.
function syncActionIcon(enabled: boolean): void {
  chrome.action.setIcon({
    // Vite copies public/ to the dist root, so runtime paths are icons/*.
    path: enabled
      ? { 16: 'icons/icon16.png', 32: 'icons/icon32.png' }
      : { 16: 'icons/icon16-off.png', 32: 'icons/icon32-off.png' },
  })
}

onSettingsChanged((settings) => syncActionIcon(settings.masterEnabled))
// Service worker restarts lose in-memory state — re-sync on each startup.
void getSettings().then((settings) => syncActionIcon(settings.masterEnabled))

chrome.commands?.onCommand.addListener(async (command) => {
  if (command === 'toggle-blur') {
    const settings = await getSettings()
    await patchSettings({ masterEnabled: !settings.masterEnabled })
  }
})

function parseTime(hhmm: string): number {
  const [h = 0, m = 0] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function inWindow(start: string, end: string, now: Date): boolean {
  const t = now.getHours() * 60 + now.getMinutes()
  const s = parseTime(start)
  const e = parseTime(end)
  // Overnight windows (e.g. 22:00–06:00) wrap past midnight.
  return s <= e ? t >= s && t < e : t >= s || t < e
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return
  const settings = await getSettings()
  if (!settings.schedule.enabled) {
    // Drop the boundary marker so re-enabling later starts fresh instead of
    // acting on a stale in/out-of-window comparison.
    await chrome.storage.local.remove(PREV_KEY)
    return
  }
  const active = inWindow(settings.schedule.start, settings.schedule.end, new Date())
  const stored = await chrome.storage.local.get(PREV_KEY)
  const prev = stored[PREV_KEY] as boolean | undefined
  await chrome.storage.local.set({ [PREV_KEY]: active })
  // Only act on a boundary crossing — leaves manual overrides alone.
  if (prev !== undefined && prev !== active) {
    await patchSettings({ masterEnabled: active })
  }
})
