/**
 * Content script entry — injected at document_start on youtube.com.
 * The observer attaches before YouTube's own JS populates thumbnails,
 * so there is no flash of unblurred content.
 */

import {
  getSettings,
  onSettingsChanged,
  type Settings,
  type SurfaceKey,
} from '../utils/storage'
import { flushCounts, type DayCounts } from '../utils/stats'
import {
  BLUR_CLASS,
  REVEALED_CLASS,
  setBlurCallback,
  syncRootState,
} from './blur-engine'
import { startObserving, stopObserving } from './observer'

// --- Stats: count blur applications, flush debounced to storage.local ---
let pendingCounts: DayCounts = {}
let flushTimer: ReturnType<typeof setTimeout> | null = null

setBlurCallback((surface: SurfaceKey) => {
  pendingCounts[surface] = (pendingCounts[surface] ?? 0) + 1
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    flushTimer = null
    const batch = pendingCounts
    pendingCounts = {}
    // chrome.runtime.id disappears when the extension is reloaded/updated
    // while this orphaned content script keeps running in an open tab —
    // storage calls then reject with "Extension context invalidated".
    if (!chrome.runtime?.id) {
      stopObserving()
      return
    }
    flushCounts(batch).catch(() => {})
  }, 5000)
})

// --- Click-to-reveal: first click reveals, second click navigates ---
let clickMode = false

document.addEventListener(
  'click',
  (e) => {
    if (!clickMode) return
    const target = e.target as Element | null
    const blurred = target?.closest?.(`.${BLUR_CLASS}`)
    if (!blurred || blurred.classList.contains(REVEALED_CLASS)) return
    e.preventDefault()
    e.stopPropagation()
    blurred.classList.add(REVEALED_CLASS)
  },
  { capture: true },
)

// --- Settings application ---
function apply(settings: Settings): void {
  syncRootState(settings)
  clickMode = settings.revealMode === 'click'
  // Don't pay observation cost while disabled.
  if (settings.masterEnabled) startObserving()
  else stopObserving()
}

getSettings().then(apply)
onSettingsChanged(apply)
