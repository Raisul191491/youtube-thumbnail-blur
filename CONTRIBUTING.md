# Contributing

## Local setup

```sh
npm install
npm run dev        # HMR dev build
npm run build      # production build to dist/
npm test           # unit tests (Vitest + jsdom)
npm run lint       # ESLint + Prettier check
npm run format     # auto-fix formatting
```

Load `dist/` as an unpacked extension via `chrome://extensions` (Developer
mode → Load unpacked).

## Fixing broken selectors

When YouTube renames elements, blur breaks on some surface. All selectors
live in `src/content/selectors.ts` — edit only that file, add the new
selector to the right category group, and verify with the manual QA checklist
in `tests/manual-qa-checklist.md`.

## Branches & commits

- `main` is protected and always releasable; open a PR even for small fixes.
- Branch names: `feat/short-description`, `fix/short-description`.
- Use [Conventional Commits](https://www.conventionalcommits.org/):
  `feat:`, `fix:`, `chore:`, `docs:`, `test:`.

## Before opening a PR

- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] Manual QA checklist run for any content-script change
- [ ] Screenshot/GIF attached if UI changed
