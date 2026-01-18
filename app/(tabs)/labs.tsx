import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Switch } from 'react-native';
import { getSettings, saveSettings, type AppSettings } from '../../lib/storage/settingsStorage';

export default function LabsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: true,
    hapticsEnabled: true,
    showHints: true,
    autoAdvance: false,
    theme: 'light'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const savedSettings = await getSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
