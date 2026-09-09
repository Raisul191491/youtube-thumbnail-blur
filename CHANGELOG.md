# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-09-10

### Added

- "Solid Rings" icon set: per-size-tuned sources, HiDPI toolbar icons, and
  a gray toolbar variant shown while blur is disabled.
- Privacy policy (PRIVACY.md).

### Changed

- Options page simplified to scheduled blurring (channel lists, keyword
  filters, and import/export removed).
- Removed the "PRO" badge from the popup header.

### Fixed

- Settings writes no longer echo-loop through `storage.onChanged`, which
  could exhaust the `chrome.storage.sync` write quota and stop changes from
  applying.
- Thumbnails in YouTube's new lockup view-model markup (home feed, search,
  related) are blurred again.
- Orphaned content scripts after an extension reload no longer log
  unhandled "Extension context invalidated" errors.

## [1.0.0] - 2026-09-10

### Added

- "Refined Dark" popup redesign: violet accent visual system, live blur
  preview strip, blur strength slider, style + reveal segmented controls,
  two-column surface grid, stats footer.
- Reveal modes: hover, click-to-reveal (first click reveals, second
  navigates), or never.
- Blur styles: blur and solid (flat gray block).
- Blur stats: per-day counters in local storage; popup shows today/this-week
  totals.
- Options page ("Advanced"): trusted-channel allowlist, always-blur
  blocklist, keyword filters, scheduled blurring, settings import/export,
  keyboard shortcut display.
- Scheduled blurring via chrome.alarms — manual toggles win until the next
  schedule boundary.
- First-install onboarding tour on the options page.
- Versioned settings schema (v1) with automatic migration from 0.1.x.

### Changed

- Keyboard shortcut default is now Ctrl+Shift+B (Cmd+Shift+B on Mac).
- Default blur strength is 14px.

## [0.1.0] - 2026-09-10

### Added

- Blur for all YouTube thumbnail surfaces (home, search, watch, Shorts,
  channels, playlists, subscriptions, history, notifications, miniplayer,
  in-player end screens).
- Dynamic content detection via batched MutationObserver +
  `yt-navigate-finish` SPA navigation handling.
- Popup with global toggle, blur strength slider, reveal-on-hover option,
  and per-surface toggles — all applied live via `chrome.storage.sync`.
- `Alt+Shift+B` keyboard shortcut to toggle blur.
