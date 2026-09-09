/**
 * Produces 1280×800 Chrome Web Store screenshots by driving Chromium with
 * the built extension loaded. Rendered at 2x and downscaled for crispness.
 *
 * Prereqs: npm run build && npx playwright install chromium --no-shell
 * Usage:   node scripts/store-screenshots.mjs
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const DIST = resolve('dist')
const OUT = 'store-assets'
const W = 1280
const H = 800

mkdirSync(OUT, { recursive: true })

const context = await chromium.launchPersistentContext('', {
  channel: 'chromium', // full build — extensions don't run in headless shell
  headless: true,
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
  args: [
    `--disable-extensions-except=${DIST}`,
    `--load-extension=${DIST}`,
    '--lang=en-US',
  ],
})

async function save(buffer, name) {
  await sharp(buffer).resize(W, H).png().toFile(`${OUT}/${name}`)
  console.log(`${OUT}/${name}`)
}

const page = await context.newPage()

// 1. Search results, blurred (home feed is empty on a fresh signed-out
// profile, search always has thumbnails)
await page.goto(
  'https://www.youtube.com/results?search_query=nature+documentary',
  { waitUntil: 'domcontentloaded' },
)
await page.waitForTimeout(6000)
const homeShot = await page.screenshot()
await save(homeShot, 'screenshot-1-search.png')

// 2. Watch page (related sidebar blurred)
await page.goto('https://www.youtube.com/watch?v=jNQXAC9IVRw', {
  waitUntil: 'domcontentloaded',
})
await page.waitForTimeout(6000)
await save(await page.screenshot(), 'screenshot-2-watch.png')

// 3. Popup composited over the home screenshot
let [worker] = context.serviceWorkers()
if (!worker) worker = await context.waitForEvent('serviceworker')
const extensionId = new URL(worker.url()).host
const popup = await context.newPage()
await popup.setViewportSize({ width: 336, height: 620 })
await popup.goto(`chrome-extension://${extensionId}/src/popup/index.html`)
await popup.waitForTimeout(1500)
const popupShot = await popup.screenshot({ fullPage: true })

const popupPng = await sharp(popupShot)
  .resize({ width: 336 })
  .png()
  .toBuffer()
const popupMeta = await sharp(popupPng).metadata()
const base = await sharp(homeShot)
  .resize(W, H)
  .composite([
    // dim the page so the popup pops
    {
      input: Buffer.from(
        `<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="black" opacity="0.45"/></svg>`,
      ),
    },
    {
      input: popupPng,
      left: W - 336 - 48,
      top: Math.max(24, Math.round((H - popupMeta.height) / 2)),
    },
  ])
  .png()
  .toBuffer()
await sharp(base).toFile(`${OUT}/screenshot-3-popup.png`)
console.log(`${OUT}/screenshot-3-popup.png`)

// 4. Options page (schedule)
const options = await context.newPage()
await options.setViewportSize({ width: W, height: H })
await options.goto(`chrome-extension://${extensionId}/src/options/index.html`)
await options.waitForTimeout(1500)
await save(await options.screenshot(), 'screenshot-4-options.png')

await context.close()
