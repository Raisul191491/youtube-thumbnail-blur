/**
 * Typed wrapper around chrome.storage.sync for extension settings.
 * Single key, versioned schema — bump `version` + add a migration step in
 * `migrate()` when the shape changes.
 */

export type SurfaceKey =
  'home' | 'search' | 'watch' | 'shorts' | 'channels' | 'notifications'

export type BlurStyle = 'blur' | 'solid'
export type RevealMode = 'hover' | 'click' | 'never'

export interface Schedule {
  enabled: boolean
  /** Local time, 'HH:MM'. */
  start: string
  end: string
}

export interface Settings {
  version: 1
  masterEnabled: boolean
  blurStrengthPx: number
  blurStyle: BlurStyle
  revealMode: RevealMode
  surfaces: Record<SurfaceKey, boolean>
  schedule: Schedule
  shortcutHintDismissed: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  version: 1,
  masterEnabled: true,
  blurStrengthPx: 14,
  blurStyle: 'blur',
  revealMode: 'hover',
  surfaces: {
    home: true,
    search: true,
    watch: true,
    shorts: true,
    channels: true,
    notifications: true,
  },
  schedule: { enabled: false, start: '09:00', end: '18:00' },
  shortcutHintDismissed: false,
}

const STORAGE_KEY = 'ytbe:settings'
/** Pre-versioning key from the 0.1.x releases. */
const LEGACY_KEY = 'ytb-settings'

interface LegacySettings {
  enabled?: boolean
  blurStrength?: number
  hoverReveal?: boolean
  categories?: Partial<Record<string, boolean>>
}

function migrateLegacy(old: LegacySettings): Settings {
  return {
    ...structuredClone(DEFAULT_SETTINGS),
    masterEnabled: old.enabled ?? true,
    blurStrengthPx: old.blurStrength ?? DEFAULT_SETTINGS.blurStrengthPx,
    revealMode: old.hoverReveal ? 'hover' : 'never',
    surfaces: {
      home: old.categories?.home ?? true,
      search: old.categories?.search ?? true,
      watch: old.categories?.watch ?? true,
      shorts: old.categories?.shorts ?? true,
      channels: old.categories?.channel ?? true,
      notifications: old.categories?.notifications ?? true,
    },
  }
}

export function normalize(raw: unknown): Settings {
  const partial = (raw ?? {}) as Partial<Settings>
  return {
    ...structuredClone(DEFAULT_SETTINGS),
    ...partial,
    version: 1,
    surfaces: { ...DEFAULT_SETTINGS.surfaces, ...partial.surfaces },
    schedule: { ...DEFAULT_SETTINGS.schedule, ...partial.schedule },
  }
}

export async function getSettings(): Promise<Settings> {
  const stored = await chrome.storage.sync.get([STORAGE_KEY, LEGACY_KEY])
  if (stored[STORAGE_KEY]) return normalize(stored[STORAGE_KEY])
  if (stored[LEGACY_KEY]) {
    const migrated = migrateLegacy(stored[LEGACY_KEY] as LegacySettings)
    await chrome.storage.sync.set({ [STORAGE_KEY]: migrated })
    await chrome.storage.sync.remove(LEGACY_KEY)
    return migrated
  }
  return structuredClone(DEFAULT_SETTINGS)
}

export async function saveSettings(settings: Settings): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEY]: normalize(settings) })
}

export async function patchSettings(patch: Partial<Settings>): Promise<void> {
  const current = await getSettings()
  await saveSettings(
    normalize({
      ...current,
      ...patch,
      surfaces: { ...current.surfaces, ...patch.surfaces },
      schedule: { ...current.schedule, ...patch.schedule },
    }),
  )
}

/** Subscribe to settings changes. Returns an unsubscribe function. */
export function onSettingsChanged(cb: (settings: Settings) => void): () => void {
  const listener = (
    changes: Record<string, chrome.storage.StorageChange>,
    area: string,
  ) => {
    if (area !== 'sync' || !changes[STORAGE_KEY]) return
    cb(normalize(changes[STORAGE_KEY].newValue))
  }
  chrome.storage.onChanged.addListener(listener)
  return () => chrome.storage.onChanged.removeListener(listener)
}
