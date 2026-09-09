/**
 * Rasterizes the per-size-tuned SVG sources in assets/icon-source/ to the
 * PNGs the manifest ships. Each size has its own SVG (see the icon plan §3):
 * naive downscaling of one master goes mushy at 16px, so small sizes are
 * deliberately simplified siblings, not scaled copies.
 *
 * Usage: npm run icons:build
 */
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const EXPORTS = [
  ['icon-16.svg', 'icon16.png', 16],
  ['icon-32.svg', 'icon32.png', 32],
  ['icon-48.svg', 'icon48.png', 48],
  ['icon-128.svg', 'icon128.png', 128],
  ['icon-16-off.svg', 'icon16-off.png', 16],
  ['icon-32-off.svg', 'icon32-off.png', 32],
]

mkdirSync('public/icons', { recursive: true })
for (const [src, out, size] of EXPORTS) {
  await sharp(`assets/icon-source/${src}`)
    .resize(size, size)
    .png()
    .toFile(`public/icons/${out}`)
  console.log(`public/icons/${out} (${size}px)`)
}
