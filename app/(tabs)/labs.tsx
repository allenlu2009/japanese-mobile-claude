import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Switch, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getSettings, saveSettings, type AppSettings } from '../../lib/storage/settingsStorage';
import { importFromFile, exportToFile, getImportHistory, type ImportHistoryEntry } from '../../lib/storage/importExport';
import { getTestCount, getCharacterAttemptCount } from '../../lib/storage/testStorage';
import Constants from 'expo-constants';

export default function LabsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: true,
    hapticsEnabled: true,
    showHints: true,
    autoAdvance: false,
    theme: 'light',
    jlptLevel: 'N3',
    includeLowerLevels: true
  });
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [history, setHistory] = useState<ImportHistoryEntry[]>([]);
  const [testCount, setTestCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [savedSettings, historyData, tests, attempts] = await Promise.all([
        getSettings(),
        getImportHistory(),
        getTestCount(),
        getCharacterAttemptCount()
      ]);
      setSettings(savedSettings);
      setHistory(historyData);
      setTestCount(tests);
      setAttemptCount(attempts);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  async function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await saveSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  async function handleImport() {
    setImporting(true);
    try {
      const result = await importFromFile();

      if (!result) {
        return; // User cancelled
      }

      if (result.errors.length > 0) {
        Alert.alert('Import Failed', `Errors:\n${result.errors.join('\n')}`, [{ text: 'OK' }]);
      } else if (result.warnings.length > 0) {
        Alert.alert(
          'Import Completed with Warnings',
          `✅ Imported ${result.testsImported} tests and ${result.attemptsImported} attempts\n\n⚠️ Warnings:\n${result.warnings.join('\n')}`,
          [{ text: 'OK', onPress: loadAll }]
        );
      } else {
        Alert.alert(
          'Import Successful!',
          `✅ Imported ${result.testsImported} tests and ${result.attemptsImported} character attempts`,
          [{ text: 'OK', onPress: loadAll }]
        );
      }
    } catch (error: any) {
      Alert.alert('Import Error', error.message);
    } finally {
      setImporting(false);
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const fileUri = await exportToFile();

      if (fileUri) {
        Alert.alert(
          'Export Successful!',
          'Your data has been exported. You can now share or save the file.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Export Failed', 'Could not export data. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Export Error', error.message);
    } finally {
      setExporting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="gap-6 px-6 py-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Settings
            </Text>
            <Text className="text-3xl font-semibold text-slate-900">
              Preferences
            </Text>
          </View>

          {/* Test Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-slate-900">
              Test Settings
            </Text>

            <View className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              {/* JLPT Level Selection */}
              <View className="p-4 border-b border-slate-100">
                <Text className="text-sm font-medium text-slate-700 mb-3">
                  JLPT Level
                </Text>
                <View className="flex-row gap-2 mb-2">
                  {(['N5', 'N4', 'N3'] as const).map((level) => (
                    <TouchableOpacity
                      key={level}
                      className={`flex-1 rounded-xl p-3 border-2 ${
                        settings.jlptLevel === level
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white'
                      }`}
                      onPress={() => updateSetting('jlptLevel', level)}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          settings.jlptLevel === level
                            ? 'text-blue-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View className="flex-row gap-2">
                  {(['N2', 'N1'] as const).map((level) => (
                    <TouchableOpacity
                      key={level}
                      className={`flex-1 rounded-xl p-3 border-2 ${
                        settings.jlptLevel === level
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white'
                      }`}
                      onPress={() => updateSetting('jlptLevel', level)}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          settings.jlptLevel === level
                            ? 'text-blue-600'
                            : 'text-slate-600'
                        }`}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text className="text-xs text-slate-500 mt-2">
                  Select your target JLPT difficulty level (N5: easiest → N1: hardest)
                </Text>
              </View>

              {/* Include Lower Levels */}
              <View className="flex-row items-center justify-between p-4 border-b border-slate-100">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-slate-700">
                    Include Lower Levels
                  </Text>
                  <Text className="text-xs text-slate-500 mt-1">
                    {settings.includeLowerLevels
                      ? 'Includes all easier levels for practice'
                      : 'Only shows selected level (exclusive)'}
                  </Text>
                </View>
                <Switch
                  value={settings.includeLowerLevels}
                  onValueChange={(value) => updateSetting('includeLowerLevels', value)}
                />
              </View>

              <View className="flex-row items-center justify-between p-4 border-b border-slate-100">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-slate-700">
                    Show Hints
                  </Text>
                  <Text className="text-xs text-slate-500 mt-1">
                    Display helpful hints during tests
                  </Text>
                </View>
                <Switch
                  value={settings.showHints}
                  onValueChange={(value) => updateSetting('showHints', value)}
                />
              </View>

              <View className="flex-row items-center justify-between p-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-slate-700">
                    Auto Advance
                  </Text>
                  <Text className="text-xs text-slate-500 mt-1">
                    Automatically move to next question
                  </Text>
                </View>
                <Switch
                  value={settings.autoAdvance}
                  onValueChange={(value) => updateSetting('autoAdvance', value)}
                />
              </View>
            </View>
          </View>

          {/* Audio & Haptics */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-slate-900">
              Audio & Haptics
            </Text>

            <View className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <View className="flex-row items-center justify-between p-4 border-b border-slate-100">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-slate-700">
                    Sound Effects
                  </Text>
                  <Text className="text-xs text-slate-500 mt-1">
                    Play sounds for correct/incorrect answers
                  </Text>
                </View>
                <Switch
                  value={settings.soundEnabled}
                  onValueChange={(value) => updateSetting('soundEnabled', value)}
                />
              </View>

              <View className="flex-row items-center justify-between p-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-slate-700">
                    Haptic Feedback
                  </Text>
                  <Text className="text-xs text-slate-500 mt-1">
                    Vibrate on button presses
                  </Text>
                </View>
                <Switch
                  value={settings.hapticsEnabled}
                  onValueChange={(value) => updateSetting('hapticsEnabled', value)}
                />
              </View>
            </View>
          </View>

          {/* Data Management */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-slate-900">
              Data Management
            </Text>

            {/* Stats Card */}
            <View className="rounded-2xl border border-slate-200 bg-white p-4">
              <Text className="text-sm font-semibold text-slate-600 mb-3">
                Current Data
              </Text>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-2xl font-bold text-slate-900">{testCount}</Text>
                  <Text className="text-sm text-slate-500">Tests</Text>
                </View>
                <View>
                  <Text className="text-2xl font-bold text-slate-900">{attemptCount}</Text>
                  <Text className="text-sm text-slate-500">Attempts</Text>
                </View>
              </View>
            </View>

            {/* Import Button */}
            <TouchableOpacity
              className="rounded-2xl bg-blue-500 p-4 active:bg-blue-600"
              onPress={handleImport}
              disabled={importing}
            >
              {importing ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-base font-semibold text-white">
                  📁 Import Data
                </Text>
              )}
            </TouchableOpacity>

            {/* Export Button */}
            <TouchableOpacity
              className="rounded-2xl border-2 border-blue-500 bg-white p-4 active:bg-blue-50"
              onPress={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <ActivityIndicator color="#3b82f6" />
              ) : (
                <Text className="text-center text-base font-semibold text-blue-500">
                  💾 Export Data
                </Text>
              )}
            </TouchableOpacity>

            {/* Import History */}
            {history.length > 0 && (
              <View className="gap-2">
                <Text className="text-sm font-medium text-slate-700">Recent Imports</Text>
                {history.slice(0, 3).map((entry) => {
                  const hasWarnings = entry.warnings && JSON.parse(entry.warnings).length > 0;
                  const hasErrors = entry.errors && JSON.parse(entry.errors).length > 0;

                  return (
                    <View
                      key={entry.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <View className="flex-row items-start justify-between mb-1">
                        <Text className="text-xs font-medium text-slate-700 flex-1">
                          {entry.fileName}
                        </Text>
                        <Text className="text-xs text-slate-400">
                          {new Date(entry.importDate).toLocaleDateString()}
                        </Text>
                      </View>

                      <View className="flex-row gap-3">
                        <Text className="text-xs text-slate-500">
                          {entry.testsImported} tests
                        </Text>
                        <Text className="text-xs text-slate-500">
                          {entry.attemptsImported} attempts
                        </Text>
                      </View>

                      {(hasWarnings || hasErrors) && (
                        <View className="mt-1">
                          {hasErrors && (
                            <Text className="text-xs text-red-600">
                              ❌ {JSON.parse(entry.errors).length} errors
                            </Text>
                          )}
                          {hasWarnings && (
                            <Text className="text-xs text-yellow-600">
                              ⚠️ {JSON.parse(entry.warnings).length} warnings
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* About */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-slate-900">
              About
            </Text>

            <View className="rounded-2xl border border-slate-200 bg-white p-4">
              <Text className="text-sm text-slate-700 mb-2">
                <Text className="font-semibold">Japanese Learning Tracker</Text>
              </Text>
              <Text className="text-xs text-slate-500 leading-5">
                Mobile companion app for tracking your Japanese language learning progress.
                Practice Hiragana, Katakana, Kanji, and Vocabulary with interactive tests
                and detailed analytics.
              </Text>
              <Text className="text-xs text-slate-400 mt-3">
                Version 1.0.0
              </Text>
            </View>
          </View>

          {/* System Registry */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-slate-900">
              System Registry
            </Text>

            <View className="rounded-2xl border border-slate-200 bg-white p-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xs text-slate-600">Runtime Version</Text>
                <Text className="text-xs font-mono text-slate-900">
                  {typeof Constants.expoConfig?.runtimeVersion === 'string'
                    ? Constants.expoConfig.runtimeVersion
                    : Constants.manifest?.runtimeVersion || '1.0.0'}
                </Text>
              </View>

              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xs text-slate-600">App Version</Text>
                <Text className="text-xs font-mono text-slate-900">
                  {Constants.expoConfig?.version || Constants.manifest?.version || '1.0.0'}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-slate-600">Build Source</Text>
                {Constants.expoConfig?.updates?.updateId ? (
                  <View className="items-end">
                    <Text className="text-xs text-slate-500">OTA Update</Text>
                    <Text className="text-xs font-mono text-green-600">
                      {Constants.expoConfig.updates.updateId.slice(0, 8)}...
                    </Text>
                  </View>
                ) : Constants.manifest2?.extra?.expoClient?.updateId ? (
                  <View className="items-end">
                    <Text className="text-xs text-slate-500">OTA Update</Text>
                    <Text className="text-xs font-mono text-green-600">
                      {Constants.manifest2.extra.expoClient.updateId.slice(0, 8)}...
                    </Text>
                  </View>
                ) : (
                  <View className="items-end">
                    <Text className="text-xs text-slate-500">Embedded Build</Text>
                    <Text className="text-xs font-mono text-blue-600">
                      {Constants.expoConfig?.extra?.gitCommit?.slice(0, 7) || '189feef'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
