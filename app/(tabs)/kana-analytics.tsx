import { useState, useEffect, useMemo } from 'react';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { getCharacterAttempts } from '../../lib/storage/testStorage';
import { calculateAllCharacterStats, getKanaStats, identifyWeakCharacters } from '../../lib/analytics/characterAnalytics';
import type { CharacterAttempt } from '../../lib/types';
import type { CharacterStats } from '../../lib/analytics/characterAnalytics';

export default function KanaAnalyticsScreen() {
  const [attempts, setAttempts] = useState<CharacterAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllResults, setShowAllResults] = useState(false);
  const [filterScriptType, setFilterScriptType] = useState<'all' | 'hiragana' | 'katakana'>('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const attemptsData = await getCharacterAttempts();
      setAttempts(attemptsData);
    } catch (error) {
      console.error('Failed to load character attempts:', error);
    } finally {
      setLoading(false);
    }
  }

  const allStats = useMemo(() => {
    return calculateAllCharacterStats(attempts);
  }, [attempts]);

  const kanaStats = useMemo(() => {
    return getKanaStats(allStats);
  }, [allStats]);

  const filteredStats = useMemo(() => {
    let filtered = kanaStats;

    // Filter by script type
    if (filterScriptType !== 'all') {
      filtered = filtered.filter(s => s.scriptType === filterScriptType);
    }

    // Filter by weak characters if showAllResults is false
    if (!showAllResults) {
      filtered = identifyWeakCharacters(filtered, 60);
    }

    // Sort by success rate (lowest first)
    return filtered.sort((a, b) => a.successRate - b.successRate);
  }, [kanaStats, filterScriptType, showAllResults]);

  const weakCharacters = useMemo(() => {
    return identifyWeakCharacters(kanaStats, 60);
  }, [kanaStats]);

  const strongCharacters = useMemo(() => {
    return kanaStats.filter(s => s.successRate >= 80);
  }, [kanaStats]);

  const averageSuccessRate = useMemo(() => {
    if (kanaStats.length === 0) return 0;
    return Math.round(kanaStats.reduce((sum, s) => sum + s.successRate, 0) / kanaStats.length);
  }, [kanaStats]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-slate-500">Loading analytics...</Text>
      </SafeAreaView>
    );
  }

  if (kanaStats.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-6xl mb-4">📊</Text>
        <Text className="text-xl font-bold text-slate-900 mb-2">No Kana Data Yet</Text>
        <Text className="text-center text-slate-500">
          Complete some Hiragana or Katakana tests to start tracking your character-level performance.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="gap-6 px-6 py-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Character Analytics
            </Text>
            <Text className="text-3xl font-semibold text-slate-900">
              Kana Performance
            </Text>
            <Text className="text-base text-slate-500">
              Track your performance on individual hiragana and katakana characters
            </Text>
          </View>

          {/* Summary Stats */}
          <View className="grid grid-cols-2 gap-3">
            <View className="rounded-2xl border border-slate-200 bg-white p-4">
              <Text className="text-2xl font-bold text-slate-900">{kanaStats.length}</Text>
              <Text className="text-sm text-slate-500 mt-1">Characters Practiced</Text>
            </View>
            <View className="rounded-2xl border border-slate-200 bg-white p-4">
              <Text className={`text-2xl font-bold ${
                averageSuccessRate >= 80 ? 'text-green-500' :
                averageSuccessRate >= 60 ? 'text-blue-500' :
                'text-orange-500'
              }`}>
                {averageSuccessRate}%
              </Text>
              <Text className="text-sm text-slate-500 mt-1">Average Success</Text>
            </View>
            <View className="rounded-2xl border border-slate-200 bg-white p-4">
              <Text className="text-2xl font-bold text-orange-500">{weakCharacters.length}</Text>
              <Text className="text-sm text-slate-500 mt-1">Need Practice</Text>
            </View>
            <View className="rounded-2xl border border-slate-200 bg-white p-4">
              <Text className="text-2xl font-bold text-green-500">{strongCharacters.length}</Text>
              <Text className="text-sm text-slate-500 mt-1">Mastered</Text>
            </View>
          </View>

          {/* Filters */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-slate-700">Filters</Text>

            {/* Script Type Filter */}
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setFilterScriptType('all')}
                className={`flex-1 rounded-xl border-2 p-3 ${
                  filterScriptType === 'all'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <Text className={`text-center text-sm font-medium ${
                  filterScriptType === 'all' ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFilterScriptType('hiragana')}
                className={`flex-1 rounded-xl border-2 p-3 ${
                  filterScriptType === 'hiragana'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <Text className={`text-center text-sm font-medium ${
                  filterScriptType === 'hiragana' ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  Hiragana
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFilterScriptType('katakana')}
                className={`flex-1 rounded-xl border-2 p-3 ${
                  filterScriptType === 'katakana'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <Text className={`text-center text-sm font-medium ${
                  filterScriptType === 'katakana' ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  Katakana
                </Text>
              </TouchableOpacity>
            </View>

            {/* Show All Toggle */}
            <TouchableOpacity
              onPress={() => setShowAllResults(!showAllResults)}
              className="rounded-xl border-2 border-slate-200 bg-white p-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-slate-700">
                    {showAllResults ? 'Showing All Characters' : 'Showing Weak Characters Only'}
                  </Text>
                  <Text className="text-xs text-slate-500 mt-1">
                    {showAllResults
                      ? 'Tap to show weak characters only (<60% accuracy)'
                      : 'Tap to show all characters'}
                  </Text>
                </View>
                <View className={`w-12 h-6 rounded-full ${showAllResults ? 'bg-blue-500' : 'bg-slate-300'}`}>
                  <View className={`w-5 h-5 mt-0.5 rounded-full bg-white shadow-sm transition-all ${
                    showAllResults ? 'ml-6' : 'ml-0.5'
                  }`} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Character List */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-slate-900">
                {showAllResults ? 'All Characters' : 'Characters to Practice'}
              </Text>
              <Text className="text-sm text-slate-500">
                {filteredStats.length} character{filteredStats.length !== 1 ? 's' : ''}
              </Text>
            </View>

            {filteredStats.length === 0 ? (
              <View className="rounded-2xl border border-green-200 bg-green-50 p-6 items-center">
                <Text className="text-4xl mb-3">🎉</Text>
                <Text className="text-lg font-semibold text-green-900 mb-1">
                  Great Progress!
                </Text>
                <Text className="text-center text-sm text-green-700">
                  No weak characters found. You're doing well!
                </Text>
              </View>
            ) : (
              filteredStats.map((stat) => (
                <CharacterCard key={stat.character} stat={stat} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CharacterCard({ stat }: { stat: CharacterStats }) {
  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return '📈';
    if (trend === 'declining') return '📉';
    return '➡️';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-blue-500';
    if (rate >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center gap-3">
          <Text className="text-4xl">{stat.character}</Text>
          <View>
            <Text className="text-sm font-medium text-slate-700">
              {stat.scriptType === 'hiragana' ? 'Hiragana' : 'Katakana'}
            </Text>
            <Text className="text-xs text-slate-500">
              {stat.totalAttempts} attempt{stat.totalAttempts !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className={`text-2xl font-bold ${getSuccessRateColor(stat.successRate)}`}>
            {stat.successRate}%
          </Text>
          <Text className="text-xs text-slate-500">
            {getTrendIcon(stat.trend)} {stat.trend}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
        <View
          className={`h-full rounded-full ${
            stat.successRate >= 80 ? 'bg-green-500' :
            stat.successRate >= 60 ? 'bg-blue-500' :
            stat.successRate >= 40 ? 'bg-orange-500' :
            'bg-red-500'
          }`}
          style={{ width: `${stat.successRate}%` }}
        />
      </View>

      {/* Stats */}
      <View className="flex-row justify-between mb-3">
        <View>
          <Text className="text-xs text-slate-500">Correct</Text>
          <Text className="text-sm font-medium text-green-600">
            {stat.correctAttempts}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-slate-500">Incorrect</Text>
          <Text className="text-sm font-medium text-red-600">
            {stat.incorrectAttempts}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-slate-500">Recent</Text>
          <Text className={`text-sm font-medium ${getSuccessRateColor(stat.recentSuccessRate)}`}>
            {stat.recentSuccessRate}%
          </Text>
        </View>
      </View>

      {/* Common Mistakes */}
      {stat.commonMistakes.length > 0 && (
        <View className="border-t border-slate-100 pt-3">
          <Text className="text-xs font-medium text-slate-600 mb-2">
            Common mistakes:
          </Text>
          <View className="flex-row gap-2 flex-wrap">
            {stat.commonMistakes.map((mistake, idx) => (
              <View
                key={idx}
                className="bg-red-50 border border-red-200 rounded-lg px-2 py-1"
              >
                <Text className="text-xs text-red-700">
                  {mistake.answer} ({mistake.count}×)
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
