import { getDatabase } from './database';

export interface AppSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  showHints: boolean;
  autoAdvance: boolean;
  theme: 'light' | 'dark';
  jlptLevel: 'N5' | 'N4' | 'N3';
  includeLowerLevels: boolean;
}

/**
 * Get a setting value
 */
async function getSetting(key: string, defaultValue: string): Promise<string> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_settings WHERE key = ?',
    [key]
  );

  return row?.value || defaultValue;
}

/**
 * Set a setting value
 */
async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
    [key, value]
  );
}

/**
 * Get all app settings
 */
export async function getSettings(): Promise<AppSettings> {
  return {
    soundEnabled: (await getSetting('sound_enabled', 'true')) === 'true',
    hapticsEnabled: (await getSetting('haptics_enabled', 'true')) === 'true',
    showHints: (await getSetting('show_hints', 'true')) === 'true',
    autoAdvance: (await getSetting('auto_advance', 'false')) === 'true',
    theme: (await getSetting('theme', 'light')) as 'light' | 'dark',
    jlptLevel: (await getSetting('jlpt_level', 'N4')) as 'N5' | 'N4' | 'N3',
    includeLowerLevels: (await getSetting('include_lower_levels', 'true')) === 'true'
  };
}

/**
 * Save app settings (full replace)
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
  await setSetting('sound_enabled', settings.soundEnabled.toString());
  await setSetting('haptics_enabled', settings.hapticsEnabled.toString());
  await setSetting('show_hints', settings.showHints.toString());
  await setSetting('auto_advance', settings.autoAdvance.toString());
  await setSetting('theme', settings.theme);
  await setSetting('jlpt_level', settings.jlptLevel);
  await setSetting('include_lower_levels', settings.includeLowerLevels.toString());
}

/**
 * Update app settings (partial)
 */
export async function updateSettings(settings: Partial<AppSettings>): Promise<void> {
  if (settings.soundEnabled !== undefined) {
    await setSetting('sound_enabled', settings.soundEnabled.toString());
  }
  if (settings.hapticsEnabled !== undefined) {
    await setSetting('haptics_enabled', settings.hapticsEnabled.toString());
  }
  if (settings.showHints !== undefined) {
    await setSetting('show_hints', settings.showHints.toString());
  }
  if (settings.autoAdvance !== undefined) {
    await setSetting('auto_advance', settings.autoAdvance.toString());
  }
  if (settings.theme !== undefined) {
    await setSetting('theme', settings.theme);
  }
  if (settings.jlptLevel !== undefined) {
    await setSetting('jlpt_level', settings.jlptLevel);
  }
  if (settings.includeLowerLevels !== undefined) {
    await setSetting('include_lower_levels', settings.includeLowerLevels.toString());
  }
}
