# Chrome Web Store Listing — copy/paste reference

## Item name
YouTube Thumbnail Blur

## Summary (132 char max)
Blurs every YouTube thumbnail — home, search, Shorts, and more — including thumbnails loaded dynamically while you scroll.

## Description
Blur every thumbnail on YouTube — home feed, search results, watch page
recommendations, Shorts, channels, playlists, subscriptions, history,
notifications, and even the in-player end screen. Catches thumbnails that
load dynamically as you scroll or navigate, so nothing slips through.

Features:
- Master on/off toggle, applied instantly, no reload
- Adjustable blur strength
- Blur style: soft blur or a flat solid block
- Reveal on hover, on click, or never
- Per-surface toggles (turn off blur for just Shorts, for example)
- Scheduled blurring — set a daily window and it turns on/off automatically
- Keyboard shortcut (Ctrl+Shift+B / Cmd+Shift+B)
- Toolbar icon shows on/off state at a glance

Privacy: this extension collects no data. Nothing is sent anywhere, ever.
Your settings sync via Chrome's own storage; blur counters stay on your
device. Full policy: see the Privacy tab or
https://github.com/Raisul191491/youtube-thumbnail-blur/blob/main/PRIVACY.md

Source code: https://github.com/Raisul191491/youtube-thumbnail-blur

## Category
Productivity (or: Fun)

## Language
English

## Screenshots (already generated in store-assets/)
1. screenshot-1-search.png — blurred search results
2. screenshot-2-watch.png — blurred watch-page sidebar
3. screenshot-3-popup.png — popup controls over a live page
4. screenshot-4-options.png — scheduled blurring page (optional, sparse)

## Privacy practices tab

**Single purpose description:**
Blurs thumbnail images on youtube.com so video content isn't visible at a
glance, per user-configured settings.

**Permission justifications:**
- `storage` — persist the user's blur settings and local usage counters.
- `alarms` — periodically check whether the optional scheduled-blurring
  window is active.
- Host permission `https://www.youtube.com/*` — required to inject the
  content script and stylesheet that apply the blur directly on YouTube's
  pages. No data is read, stored, or transmitted off-device; the script only
  inspects DOM structure to locate thumbnail images.

**Data usage disclosures:**
- Does this extension collect user data? **No.**
- All toggles in the "Data usage" questionnaire (personally identifiable
  info, health, financial, authentication, personal communications,
  location, web history, user activity, website content) → **No** to all.

## Distribution
Public (or Unlisted for a soft launch / friend testing first)
