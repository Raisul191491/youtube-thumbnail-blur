/**
 * All YouTube thumbnail selectors live here — the single file to edit when
 * YouTube renames elements (it does, every few months).
 *
 * Layered strategy: `generic` is the broad net that catches ~90% of
 * thumbnails; per-surface groups reinforce edge cases and let the popup
 * disable blur per surface.
 */

import type { SurfaceKey } from '../utils/storage'

export interface SelectorGroup {
  surface: SurfaceKey
  selectors: string[]
}

/**
 * Broad net. Surface "watch" is a reasonable default for anything caught
 * only by these (most generic matches on non-watch pages are also matched
 * by a specific group below, which wins because it runs later).
 */
export const GENERIC_SELECTORS: string[] = [
  'ytd-thumbnail img',
  '#thumbnail img',
  'a#thumbnail img',
  'yt-image img',
  // 2024+ lockup view-model markup (home feed, search, related, playlists)
  'yt-thumbnail-view-model img',
  'yt-collection-thumbnail-view-model img',
  'yt-lockup-view-model img.yt-core-image',
]

export const SELECTOR_GROUPS: SelectorGroup[] = [
  {
    surface: 'home',
    selectors: [
      'ytd-rich-item-renderer ytd-thumbnail img',
      'ytd-rich-item-renderer yt-thumbnail-view-model img',
    ],
  },
  {
    surface: 'search',
    // Also covers the History page (same renderer).
    selectors: [
      'ytd-video-renderer ytd-thumbnail img',
      'ytd-video-renderer yt-thumbnail-view-model img',
      'ytd-radio-renderer ytd-thumbnail img',
    ],
  },
  {
    surface: 'watch',
    selectors: [
      // Up next / related sidebar
      'ytd-compact-video-renderer ytd-thumbnail img',
      // Autoplay overlay + video wall at video end
      '.ytp-autonav-endscreen-upnext-thumbnail',
      '.ytp-videowall-still-image',
      // End-screen cards inside the player
      '.ytp-ce-covering-image',
      '.ytp-ce-element img',
      // Miniplayer
      'ytd-miniplayer ytd-thumbnail img',
    ],
  },
  {
    surface: 'shorts',
    selectors: [
      // Shorts shelf in feed/search
      'ytm-shorts-lockup-view-model img',
      'ytd-reel-item-renderer img',
      // Shorts player
      '#shorts-player img',
      'ytd-reel-video-renderer img',
    ],
  },
  {
    surface: 'channels',
    // Channel Videos tab, Subscriptions grid, Playlist pages
    selectors: [
      'ytd-grid-video-renderer ytd-thumbnail img',
      'ytd-playlist-video-renderer ytd-thumbnail img',
    ],
  },
  {
    surface: 'notifications',
    selectors: ['ytd-notification-renderer img'],
  },
]

/** Every selector (generic + specific) as one comma-joined query. */
export const ALL_SELECTORS: string = [
  ...GENERIC_SELECTORS,
  ...SELECTOR_GROUPS.flatMap((g) => g.selectors),
].join(',')
