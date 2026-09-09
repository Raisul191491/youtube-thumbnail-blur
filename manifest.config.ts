import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json' with { type: 'json' }

// Version is sourced from package.json so the two never drift.
export default defineManifest({
  manifest_version: 3,
  name: 'YouTube Thumbnail Blur',
  version: pkg.version,
  description:
    'Blur YouTube thumbnails everywhere, including dynamically loaded content.',
  permissions: ['storage', 'alarms'],
  host_permissions: ['https://www.youtube.com/*'],
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
  action: {
    default_popup: 'src/popup/index.html',
    // Both sizes so Chrome picks the sharper one per display density.
    default_icon: {
      16: 'public/icons/icon16.png',
      32: 'public/icons/icon32.png',
    },
  },
  options_page: 'src/options/index.html',
  content_scripts: [
    {
      matches: ['https://www.youtube.com/*'],
      js: ['src/content/content-script.ts'],
      css: ['src/styles/content.css'],
      run_at: 'document_start',
    },
  ],
  commands: {
    'toggle-blur': {
      suggested_key: { default: 'Ctrl+Shift+B', mac: 'Command+Shift+B' },
      description: 'Toggle thumbnail blur',
    },
  },
  icons: {
    16: 'public/icons/icon16.png',
    32: 'public/icons/icon32.png',
    48: 'public/icons/icon48.png',
    128: 'public/icons/icon128.png',
  },
})
