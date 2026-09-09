/**
 * Blur counters, bucketed per day in chrome.storage.local (not sync — no
 * cross-device need, avoids sync quota pressure).
 * Shape: { 'YYYY-MM-DD': { home: n, search: n, ... } }
 */

import type { SurfaceKey } from './storage'

export type DayCounts = Partial<Record<SurfaceKey, number>>
export type StatsData = Record<string, DayCounts>

const STATS_KEY = 'ytbe:stats'
const KEEP_DAYS = 14

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export async function readStats(): Promise<StatsData> {
  const stored = await chrome.storage.local.get(STATS_KEY)
  return (stored[STATS_KEY] as StatsData) ?? {}
}

/** Merge pending in-memory counts into today's bucket and prune old days. */
export async function flushCounts(pending: DayCounts): Promise<void> {
  const stats = await readStats()
  const key = todayKey()
  const day: DayCounts = { ...stats[key] }
  for (const [surface, n] of Object.entries(pending)) {
    const k = surface as SurfaceKey
    day[k] = (day[k] ?? 0) + (n ?? 0)
  }
  stats[key] = day
  const keys = Object.keys(stats).sort()
  for (const k of keys.slice(0, Math.max(0, keys.length - KEEP_DAYS))) {
    delete stats[k]
  }
  await chrome.storage.local.set({ [STATS_KEY]: stats })
}

export function sumDay(day: DayCounts | undefined): number {
  if (!day) return 0
  return Object.values(day).reduce((a, b) => a + (b ?? 0), 0)
}

/** Totals for today and the trailing 7 days (inclusive of today). */
export function summarize(stats: StatsData): {
  today: number
  week: number
  busiest: SurfaceKey | null
} {
  const now = new Date()
  const today = sumDay(stats[todayKey(now)])
  let week = 0
  const perSurface: DayCounts = {}
  for (let i = 0; i < 7; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const day = stats[todayKey(d)]
    week += sumDay(day)
    for (const [surface, n] of Object.entries(day ?? {})) {
      const k = surface as SurfaceKey
      perSurface[k] = (perSurface[k] ?? 0) + (n ?? 0)
    }
  }
  let busiest: SurfaceKey | null = null
  let max = 0
  for (const [surface, n] of Object.entries(perSurface)) {
    if ((n ?? 0) > max) {
      max = n ?? 0
      busiest = surface as SurfaceKey
    }
  }
  return { today, week, busiest }
}
