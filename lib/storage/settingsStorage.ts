import { getDatabase } from './database';

export interface AppSettings {
  audioEnabled: boolean;
  autoPlayAudio: boolean;
  audioSpeed: number;
  hapticEnabled: boolean;
  darkMode: 'auto' | 'light' | 'dark';
  notificationsEnabled: boolean;
  reminderTime: string;
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
    audioEnabled: (await getSetting('audio_enabled', 'true')) === 'true',
    autoPlayAudio: (await getSetting('auto_play_audio', 'true')) === 'true',
    audioSpeed: parseFloat(await getSetting('audio_speed', '0.8')),
    hapticEnabled: (await getSetting('haptic_enabled', 'true')) === 'true',
    darkMode: (await getSetting('dark_mode', 'auto')) as 'auto' | 'light' | 'dark',
    notificationsEnabled: (await getSetting('notifications_enabled', 'true')) === 'true',
    reminderTime: await getSetting('reminder_time', '20:00')
  };
}

/**
 * Update app settings
 */
export async function updateSettings(settings: Partial<AppSettings>): Promise<void> {
  if (settings.audioEnabled !== undefined) {
    await setSetting('audio_enabled', settings.audioEnabled.toString());
  }
  if (settings.autoPlayAudio !== undefined) {
    await setSetting('auto_play_audio', settings.autoPlayAudio.toString());
  }
  if (settings.audioSpeed !== undefined) {
    await setSetting('audio_speed', settings.audioSpeed.toString());
  }
  if (settings.hapticEnabled !== undefined) {
    await setSetting('haptic_enabled', settings.hapticEnabled.toString());
  }
  if (settings.darkMode !== undefined) {
    await setSetting('dark_mode', settings.darkMode);
  }
  if (settings.notificationsEnabled !== undefined) {
    await setSetting('notifications_enabled', settings.notificationsEnabled.toString());
  }
  if (settings.reminderTime !== undefined) {
    await setSetting('reminder_time', settings.reminderTime);
  }
}
