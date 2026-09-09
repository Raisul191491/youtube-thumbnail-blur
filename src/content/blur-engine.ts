/**
 * Tags thumbnail elements with the blur class + surface attribute.
 * Actual blurring is pure CSS driven by classes on <html> (see
 * styles/content.css) — toggling settings never walks the DOM.
 */

import type { Settings, SurfaceKey } from '../utils/storage'
import { ALL_SELECTORS, GENERIC_SELECTORS, SELECTOR_GROUPS } from './selectors'

export const BLUR_CLASS = 'ytb-blur'
export const REVEALED_CLASS = 'ytb-revealed'
export const SURFACE_ATTR = 'data-ytb-cat'

const GENERIC_QUERY = GENERIC_SELECTORS.join(',')

let onBlurred: ((surface: SurfaceKey) => void) | null = null

/** Called once per newly blurred thumbnail (stats hook). */
export function setBlurCallback(cb: (surface: SurfaceKey) => void): void {
  onBlurred = cb
}

function surfaceOf(el: Element): SurfaceKey {
  for (const group of SELECTOR_GROUPS) {
    if (el.matches(group.selectors.join(','))) return group.surface
  }
  // Generic-only match: default to "watch" (safest catch-all surface).
  return 'watch'
}

function tag(el: Element): void {
  if (el.classList.contains(BLUR_CLASS)) return
  el.classList.add(BLUR_CLASS)
  const surface = surfaceOf(el)
  el.setAttribute(SURFACE_ATTR, surface)
  onBlurred?.(surface)
}

/**
 * Find and tag every thumbnail within `root` (inclusive).
 * Cheap to call repeatedly — already-tagged nodes are skipped.
 */
export function applyBlurWithin(root: ParentNode & Node): void {
  if (root.nodeType === Node.ELEMENT_NODE) {
    const el = root as Element
    if (el.matches(ALL_SELECTORS) || el.matches(GENERIC_QUERY)) tag(el)
  }
  root.querySelectorAll(ALL_SELECTORS).forEach(tag)
}

/**
 * Reflect settings as classes / CSS vars on <html>. All blur behavior is
 * CSS-only from here, so this is O(1) regardless of page size.
 */
export function syncRootState(settings: Settings): void {
  const root = document.documentElement
  root.classList.toggle('ytb-on', settings.masterEnabled)
  root.style.setProperty('--ytb-strength', `${settings.blurStrengthPx}px`)
  for (const mode of ['hover', 'click', 'never'] as const) {
    root.classList.toggle(`ytb-reveal-${mode}`, settings.revealMode === mode)
  }
  for (const style of ['blur', 'solid'] as const) {
    root.classList.toggle(`ytb-style-${style}`, settings.blurStyle === style)
  }
  for (const [surface, on] of Object.entries(settings.surfaces)) {
    root.classList.toggle(`ytb-off-${surface}`, !on)
  }
}
