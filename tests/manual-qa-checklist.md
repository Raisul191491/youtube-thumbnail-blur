# Manual QA Checklist

Run before every release. Load the built extension, open youtube.com, and
verify blur applies on each surface (and unblurs when its category or the
global toggle is off).

- [ ] Home feed grid (scroll several pages — infinite scroll)
- [ ] Search results (including radio/mix cards)
- [ ] Watch page — up next / related sidebar
- [ ] Watch page — autoplay "up next" overlay at video end
- [ ] Watch page — video wall / end-screen cards inside player
- [ ] Shorts shelf in feed and search
- [ ] Shorts player
- [ ] Channel "Videos" tab
- [ ] Playlist page
- [ ] Subscriptions grid
- [ ] History page
- [ ] Notification dropdown
- [ ] Miniplayer
- [ ] SPA navigation: home → video → back → search (no unblurred flashes)
- [ ] Popup toggle applies live without page reload
- [ ] Blur strength slider applies live
- [ ] Reveal-on-hover works when enabled
- [ ] `Alt+Shift+B` toggles blur
- [ ] Settings persist after browser restart
