// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import {
  applyBlurWithin,
  BLUR_CLASS,
  SURFACE_ATTR,
  syncRootState,
} from '../src/content/blur-engine'
import { ALL_SELECTORS, SELECTOR_GROUPS } from '../src/content/selectors'
import { DEFAULT_SETTINGS, normalize, type Settings } from '../src/utils/storage'

function settings(patch: Partial<Settings> = {}): Settings {
  return normalize({ ...structuredClone(DEFAULT_SETTINGS), ...patch })
}

beforeEach(() => {
  document.body.innerHTML = ''
  syncRootState(settings())
})

describe('selectors', () => {
  it('every selector is valid CSS', () => {
    // querySelector throws on invalid selectors — this guards typos when
    // the selector table gets edited after a YouTube DOM change.
    expect(() => document.querySelectorAll(ALL_SELECTORS)).not.toThrow()
  })

  it('every group has at least one selector', () => {
    for (const group of SELECTOR_GROUPS) {
      expect(group.selectors.length).toBeGreaterThan(0)
    }
  })
})

describe('applyBlurWithin', () => {
  it('tags home-feed thumbnails with the home surface', () => {
    document.body.innerHTML = `
      <ytd-rich-item-renderer>
        <ytd-thumbnail><img src="x.jpg" /></ytd-thumbnail>
      </ytd-rich-item-renderer>`
    applyBlurWithin(document.body)
    const img = document.querySelector('img')!
    expect(img.classList.contains(BLUR_CLASS)).toBe(true)
    expect(img.getAttribute(SURFACE_ATTR)).toBe('home')
  })

  it('tags new lockup view-model thumbnails', () => {
    document.body.innerHTML = `
      <yt-lockup-view-model>
        <yt-thumbnail-view-model><img src="x.jpg" /></yt-thumbnail-view-model>
      </yt-lockup-view-model>`
    applyBlurWithin(document.body)
    expect(document.querySelector('img')!.classList.contains(BLUR_CLASS)).toBe(true)
  })

  it('tags generic-only matches with the watch fallback surface', () => {
    document.body.innerHTML = `<yt-image><img src="x.jpg" /></yt-image>`
    applyBlurWithin(document.body)
    expect(document.querySelector('img')!.getAttribute(SURFACE_ATTR)).toBe('watch')
  })

  it('is idempotent', () => {
    document.body.innerHTML = `<ytd-thumbnail><img src="x.jpg" /></ytd-thumbnail>`
    applyBlurWithin(document.body)
    applyBlurWithin(document.body)
    const img = document.querySelector('img')!
    expect(img.className.split(' ').filter((c) => c === BLUR_CLASS)).toHaveLength(1)
  })

  it('ignores non-thumbnail images', () => {
    document.body.innerHTML = `<div><img src="avatar.jpg" /></div>`
    applyBlurWithin(document.body)
    expect(document.querySelector('img')!.classList.contains(BLUR_CLASS)).toBe(false)
  })
})

describe('syncRootState', () => {
  it('reflects settings as root classes and CSS var', () => {
    syncRootState(
      settings({
        masterEnabled: true,
        revealMode: 'click',
        blurStyle: 'solid',
        blurStrengthPx: 32,
        surfaces: { ...DEFAULT_SETTINGS.surfaces, shorts: false },
      }),
    )
    const root = document.documentElement
    expect(root.classList.contains('ytb-on')).toBe(true)
    expect(root.classList.contains('ytb-reveal-click')).toBe(true)
    expect(root.classList.contains('ytb-reveal-hover')).toBe(false)
    expect(root.classList.contains('ytb-style-solid')).toBe(true)
    expect(root.classList.contains('ytb-off-shorts')).toBe(true)
    expect(root.classList.contains('ytb-off-home')).toBe(false)
    expect(root.style.getPropertyValue('--ytb-strength')).toBe('32px')
  })

  it('removes on-class when disabled', () => {
    syncRootState(settings({ masterEnabled: false }))
    expect(document.documentElement.classList.contains('ytb-on')).toBe(false)
  })
})
