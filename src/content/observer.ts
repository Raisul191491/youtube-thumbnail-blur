/**
 * Watches YouTube's SPA DOM for new thumbnails.
 *
 * Mutations fire in bursts during infinite scroll, so batches are coalesced
 * through requestIdleCallback (setTimeout fallback) and only the added
 * subtrees are re-queried — never the whole document after the initial pass.
 */

import { applyBlurWithin } from './blur-engine'

const pending = new Set<Node>()
let scheduled = false

const scheduleIdle: (fn: () => void) => void =
  typeof requestIdleCallback === 'function'
    ? (fn) => requestIdleCallback(fn, { timeout: 200 })
    : (fn) => setTimeout(fn, 50)

function flush(): void {
  scheduled = false
  const nodes = [...pending]
  pending.clear()
  for (const node of nodes) {
    if (node.isConnected) applyBlurWithin(node as ParentNode & Node)
  }
}

const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) pending.add(node)
    }
  }
  if (pending.size > 0 && !scheduled) {
    scheduled = true
    scheduleIdle(flush)
  }
})

let observing = false

export function startObserving(): void {
  if (observing) return
  observing = true
  observer.observe(document.documentElement, { childList: true, subtree: true })
  // Fresh full pass: SPA navigations can swap large subtrees in ways the
  // observer batches oddly.
  document.addEventListener('yt-navigate-finish', onNavigate)
  applyBlurWithin(document)
}

export function stopObserving(): void {
  if (!observing) return
  observing = false
  observer.disconnect()
  document.removeEventListener('yt-navigate-finish', onNavigate)
  pending.clear()
}

function onNavigate(): void {
  applyBlurWithin(document)
}
