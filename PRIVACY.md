# Privacy Policy — YouTube Thumbnail Blur

_Last updated: 2026-09-10_

## Summary

This extension collects **no data**. Nothing you do ever leaves your
browser.

## What the extension stores

- **Your settings** (blur on/off, strength, style, reveal mode, per-surface
  toggles, schedule) are stored via `chrome.storage.sync`. Chrome may sync
  these across your own signed-in browsers; the extension itself never
  transmits them anywhere.
- **Blur counters** (how many thumbnails were blurred per day, kept 14 days)
  are stored via `chrome.storage.local` on your device only, purely to show
  the small stats line in the popup.

## What the extension does NOT do

- No analytics, telemetry, or tracking of any kind.
- No network requests to any server.
- No reading of your watch history, account, or page content beyond finding
  thumbnail images to blur.
- No selling or sharing of data — there is no data to sell or share.

## Permissions justification

| Permission | Why |
|---|---|
| `storage` | Persist your settings and local blur counters |
| `alarms` | Run the optional scheduled-blurring check |
| Host access to `youtube.com` | Inject the content script and CSS that blur thumbnails — used for nothing else |

## Contact

Questions: open an issue on this repository.
