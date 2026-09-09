import { describe, expect, it } from 'vitest'
import { summarize, sumDay, todayKey } from '../src/utils/stats'

describe('stats', () => {
  it('formats today key as YYYY-MM-DD', () => {
    expect(todayKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('sums a day bucket', () => {
    expect(sumDay({ home: 3, shorts: 2 })).toBe(5)
    expect(sumDay(undefined)).toBe(0)
  })

  it('summarizes today, trailing week, and busiest surface', () => {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const old = new Date(now)
    old.setDate(now.getDate() - 10)
    const stats = {
      [todayKey(now)]: { home: 5, search: 1 },
      [todayKey(yesterday)]: { shorts: 10 },
      [todayKey(old)]: { home: 100 }, // outside the 7-day window
    }
    const s = summarize(stats)
    expect(s.today).toBe(6)
    expect(s.week).toBe(16)
    expect(s.busiest).toBe('shorts')
  })
})
