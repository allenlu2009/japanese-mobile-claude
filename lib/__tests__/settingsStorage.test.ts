// Create a mock database object that will be shared
const mockDb = {
  getFirstAsync: jest.fn(),
  runAsync: jest.fn(),
  execAsync: jest.fn(),
  getAllAsync: jest.fn(),
};

// Mock the database module before importing settingsStorage
jest.mock('../storage/database', () => ({
  getDatabase: jest.fn(() => Promise.resolve(mockDb)),
  initDatabase: jest.fn(() => Promise.resolve(mockDb)),
}));

import {
  getSettings,
  saveSettings,
  updateSettings,
  type AppSettings
} from '../storage/settingsStorage';

describe('Settings Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSettings', () => {
    it('should return default settings when no settings exist', async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);

      const settings = await getSettings();

      // Check database was queried for each setting
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        'SELECT value FROM app_settings WHERE key = ?',
        ['sound_enabled']
      );

      expect(settings).toEqual({
        soundEnabled: true,
        hapticsEnabled: true,
        showHints: true,
        autoAdvance: false,
        theme: 'light'
      });
    });

    it('should retrieve and parse stored settings', async () => {
      mockDb.getFirstAsync
        .mockResolvedValueOnce({ value: 'false' }) // sound_enabled
        .mockResolvedValueOnce({ value: 'false' }) // haptics_enabled
        .mockResolvedValueOnce({ value: 'false' }) // show_hints
        .mockResolvedValueOnce({ value: 'true' })  // auto_advance
        .mockResolvedValueOnce({ value: 'dark' }); // theme

      const settings = await getSettings();

      expect(settings).toEqual({
        soundEnabled: false,
        hapticsEnabled: false,
        showHints: false,
        autoAdvance: true,
        theme: 'dark'
      });
    });

    it('should handle boolean string conversion correctly', async () => {
      mockDb.getFirstAsync
        .mockResolvedValueOnce({ value: 'true' })  // sound_enabled
        .mockResolvedValueOnce({ value: 'false' }) // haptics_enabled
        .mockResolvedValueOnce({ value: 'true' })  // show_hints
        .mockResolvedValueOnce({ value: 'false' }) // auto_advance
        .mockResolvedValueOnce({ value: 'light' }); // theme

      const settings = await getSettings();

      expect(settings.soundEnabled).toBe(true);
      expect(settings.hapticsEnabled).toBe(false);
      expect(settings.showHints).toBe(true);
      expect(settings.autoAdvance).toBe(false);
      expect(settings.theme).toBe('light');
    });
  });

  describe('saveSettings', () => {
    it('should save all settings', async () => {
      mockDb.runAsync.mockResolvedValue({ changes: 1 });

      const settings: AppSettings = {
        soundEnabled: false,
        hapticsEnabled: true,
        showHints: false,
        autoAdvance: true,
        theme: 'dark'
      };

      await saveSettings(settings);

      expect(mockDb.runAsync).toHaveBeenCalledTimes(5);
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
        ['sound_enabled', 'false']
      );
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
        ['haptics_enabled', 'true']
      );
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
        ['show_hints', 'false']
      );
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
        ['auto_advance', 'true']
      );
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
        ['theme', 'dark']
      );
    });
  });

  describe('updateSettings', () => {
    it('should update only provided settings', async () => {
      mockDb.runAsync.mockResolvedValue({ changes: 1 });

      await updateSettings({ soundEnabled: false });

      // Should only call runAsync once for the single updated field
      expect(mockDb.runAsync).toHaveBeenCalledTimes(1);
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
        ['sound_enabled', 'false']
      );
    });

    it('should update multiple settings', async () => {
      mockDb.runAsync.mockResolvedValue({ changes: 1 });

      await updateSettings({ theme: 'dark', autoAdvance: true, soundEnabled: false });

      // Should call runAsync for each updated field
      expect(mockDb.runAsync).toHaveBeenCalledTimes(3);
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
        ['sound_enabled', 'false']
      );
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
        ['auto_advance', 'true']
      );
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
        ['theme', 'dark']
      );
    });

    it('should not update settings that are not provided', async () => {
      mockDb.runAsync.mockResolvedValue({ changes: 1 });

      await updateSettings({ soundEnabled: true });

      expect(mockDb.runAsync).toHaveBeenCalledTimes(1);
      expect(mockDb.runAsync).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining(['theme', expect.anything()])
      );
    });
  });
});
