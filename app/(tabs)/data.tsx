import { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { importFromFile, exportToFile, getImportHistory, type ImportHistoryEntry } from '../../lib/storage/importExport';
import { getTestCount, getCharacterAttemptCount } from '../../lib/storage/testStorage';
import Constants from 'expo-constants';

export default function DataScreen() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [history, setHistory] = useState<ImportHistoryEntry[]>([]);
  const [testCount, setTestCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [historyData, tests, attempts] = await Promise.all([
        getImportHistory(),
        getTestCount(),
        getCharacterAttemptCount()
      ]);
      setHistory(historyData);
      setTestCount(tests);
      setAttemptCount(attempts);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  async function handleImport() {
    setImporting(true);
    try {
      const result = await importFromFile();

      if (!result) {
        // User cancelled
        return;
      }

      // Show result dialog
      if (result.errors.length > 0) {
        Alert.alert(
          'Import Failed',
          `Errors:\n${result.errors.join('\n')}`,
          [{ text: 'OK' }]
        );
      } else if (result.warnings.length > 0) {
        Alert.alert(
          'Import Completed with Warnings',
          `✅ Imported ${result.testsImported} tests and ${result.attemptsImported} attempts\n\n⚠️ Warnings:\n${result.warnings.join('\n')}`,
          [{ text: 'OK', onPress: loadData }]
        );
      } else {
        Alert.alert(
          'Import Successful!',
          `✅ Imported ${result.testsImported} tests and ${result.attemptsImported} character attempts`,
          [{ text: 'OK', onPress: loadData }]
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
              Data Management
            </Text>
            <Text className="text-3xl font-semibold text-slate-900">
              Import & Export
            </Text>
            <Text className="text-base text-slate-500">
              Transfer data from your web version or back up your mobile progress.
            </Text>
          </View>

          {/* Stats Card */}
          <View className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
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

          {/* Import Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-slate-900">
              Import from Web
            </Text>

            <TouchableOpacity
              className="rounded-2xl bg-blue-500 p-5 active:bg-blue-600"
              onPress={handleImport}
              disabled={importing}
            >
              {importing ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text className="text-center text-lg font-semibold text-white">
                    📁 Browse Files
                  </Text>
                  <Text className="text-center text-sm text-blue-100 mt-1">
                    Select JSON export from web version
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View className="rounded-2xl border border-slate-200 bg-white p-4">
              <Text className="text-sm font-medium text-slate-700 mb-2">
                ℹ️ Import Instructions
              </Text>
              <Text className="text-xs text-slate-500 leading-5">
                1. On your web version, click "Export Data"{'\n'}
                2. Save the JSON file to your device{'\n'}
                3. Click "Browse Files" above to select it{'\n'}
                4. Data will be merged (no duplicates)
              </Text>
            </View>
          </View>

          {/* Export Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-slate-900">
              Export Mobile Data
            </Text>

            <TouchableOpacity
              className="rounded-2xl border-2 border-blue-500 bg-white p-5 active:bg-blue-50"
              onPress={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <ActivityIndicator color="#3b82f6" />
              ) : (
                <>
                  <Text className="text-center text-lg font-semibold text-blue-500">
                    💾 Export Data
                  </Text>
                  <Text className="text-center text-sm text-slate-500 mt-1">
                    Save or share your mobile data
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Import History */}
          {history.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-slate-900">
                Import History
              </Text>

              {history.slice(0, 5).map((entry) => {
                const hasWarnings = entry.warnings && JSON.parse(entry.warnings).length > 0;
                const hasErrors = entry.errors && JSON.parse(entry.errors).length > 0;

                return (
                  <View
                    key={entry.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <View className="flex-row items-start justify-between mb-2">
                      <Text className="text-sm font-medium text-slate-700 flex-1">
                        {entry.fileName}
                      </Text>
                      <Text className="text-xs text-slate-400">
                        {new Date(entry.importDate).toLocaleDateString()}
                      </Text>
                    </View>

                    <View className="flex-row gap-4">
                      <Text className="text-xs text-slate-500">
                        {entry.testsImported} tests
                      </Text>
                      <Text className="text-xs text-slate-500">
                        {entry.attemptsImported} attempts
                      </Text>
                    </View>

                    {(hasWarnings || hasErrors) && (
                      <View className="mt-2 pt-2 border-t border-slate-100">
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

        {/* System Registry Footer */}
        <View className="mt-8 pt-6 border-t border-slate-200">
          <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            System Registry
          </Text>
          <View className="rounded-xl bg-slate-50 p-3">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-xs text-slate-600">App Version</Text>
              <Text className="text-xs font-mono text-slate-900">
                {Constants.expoConfig?.version || '1.0.0'}
              </Text>
            </View>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-xs text-slate-600">Runtime Version</Text>
              <Text className="text-xs font-mono text-slate-900">
                {Constants.expoConfig?.runtimeVersion || '1.0.0'}
              </Text>
            </View>
            {Constants.expoConfig?.updates?.updateId && (
              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-slate-600">Update ID</Text>
                <Text className="text-xs font-mono text-slate-900">
                  {Constants.expoConfig.updates.updateId.slice(0, 8)}...
                </Text>
              </View>
            )}
            {!Constants.expoConfig?.updates?.updateId && (
              <Text className="text-xs text-slate-400 mt-1">
                No OTA update loaded (running from build)
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
