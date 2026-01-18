import { useState, useEffect, useMemo } from 'react';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { getCharacterAttempts } from '../../lib/storage/testStorage';
import { calculateAllCharacterStats, getJLPTStats, groupStatsByJLPTLevel } from '../../lib/analytics/characterAnalytics';
import type { CharacterAttempt } from '../../lib/types';
import type { CharacterStats } from '../../lib/analytics/characterAnalytics';

export default function JLPTAnalyticsScreen() {
  const [attempts, setAttempts] = useState<CharacterAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'all'>('all');
  const [filterScriptType, setFilterScriptType] = useState<'all' | 'kanji' | 'vocabulary'>('all');

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

  const jlptStats = useMemo(() => {
    return getJLPTStats(allStats);
  }, [allStats]);

  const groupedStats = useMemo(() => {
    return groupStatsByJLPTLevel(jlptStats);
  }, [jlptStats]);

  const filteredStats = useMemo(() => {
    let filtered = jlptStats;

    // Filter by JLPT level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(s => s.jlptLevel === selectedLevel);
    }

    // Filter by script type
    if (filterScriptType !== 'all') {
      filtered = filtered.filter(s => s.scriptType === filterScriptType);
    }

    // Sort by success rate (lowest first)
    return filtered.sort((a, b) => a.successRate - b.successRate);
  }, [jlptStats, selectedLevel, filterScriptType]);

  const n5Stats = useMemo(() => groupedStats.N5, [groupedStats]);
  const n4Stats = useMemo(() => groupedStats.N4, [groupedStats]);

  const n5AverageSuccess = useMemo(() => {
    if (n5Stats.length === 0) return 0;
    return Math.round(n5Stats.reduce((sum, s) => sum + s.successRate, 0) / n5Stats.length);
  }, [n5Stats]);

  const n4AverageSuccess = useMemo(() => {
    if (n4Stats.length === 0) return 0;
    return Math.round(n4Stats.reduce((sum, s) => sum + s.successRate, 0) / n4Stats.length);
  }, [n4Stats]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-slate-500">Loading analytics...</Text>
      </SafeAreaView>
    );
  }

  if (jlptStats.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-6xl mb-4">📚</Text>
        <Text className="text-xl font-bold text-slate-900 mb-2">No JLPT Data Yet</Text>
        <Text className="text-center text-slate-500">
          Complete some Kanji or Vocabulary tests to start tracking your JLPT progress.
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
              JLPT Analytics
            </Text>
            <Text className="text-3xl font-semibold text-slate-900">
              Kanji & Vocabulary
            </Text>
            <Text className="text-base text-slate-500">
              Track your progress on JLPT kanji and vocabulary
            </Text>
          </View>

          {/* Level Summary */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={() => setSelectedLevel(selectedLevel === 'N5' ? 'all' : 'N5')}
              className={`rounded-2xl border-2 p-4 ${
                selectedLevel === 'N5' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className={`text-xl font-bold ${
                    selectedLevel === 'N5' ? 'text-blue-600' : 'text-slate-900'
                  }`}>
                    JLPT N5
                  </Text>
                  <Text className="text-sm text-slate-500 mt-1">
                    {n5Stats.length} items practiced
                  </Text>
                </View>
                <View className="items-end">
                  <Text className={`text-3xl font-bold ${
                    n5AverageSuccess >= 80 ? 'text-green-500' :
                    n5AverageSuccess >= 60 ? 'text-blue-500' :
                    'text-orange-500'
                  }`}>
                    {n5AverageSuccess}%
                  </Text>
                  <Text className="text-xs text-slate-500">Average</Text>
                </View>
              </View>
              {n5Stats.length > 0 && (
                <View className="h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
                  <View
                    className={`h-full rounded-full ${
                      n5AverageSuccess >= 80 ? 'bg-green-500' :
                      n5AverageSuccess >= 60 ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${n5AverageSuccess}%` }}
                  />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedLevel(selectedLevel === 'N4' ? 'all' : 'N4')}
              className={`rounded-2xl border-2 p-4 ${
                selectedLevel === 'N4' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className={`text-xl font-bold ${
                    selectedLevel === 'N4' ? 'text-blue-600' : 'text-slate-900'
                  }`}>
                    JLPT N4
                  </Text>
                  <Text className="text-sm text-slate-500 mt-1">
                    {n4Stats.length} items practiced
                  </Text>
                </View>
                <View className="items-end">
                  <Text className={`text-3xl font-bold ${
                    n4AverageSuccess >= 80 ? 'text-green-500' :
                    n4AverageSuccess >= 60 ? 'text-blue-500' :
                    'text-orange-500'
                  }`}>
                    {n4AverageSuccess}%
                  </Text>
                  <Text className="text-xs text-slate-500">Average</Text>
                </View>
              </View>
              {n4Stats.length > 0 && (
                <View className="h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
                  <View
                    className={`h-full rounded-full ${
                      n4AverageSuccess >= 80 ? 'bg-green-500' :
                      n4AverageSuccess >= 60 ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${n4AverageSuccess}%` }}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-slate-700">Type Filter</Text>
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
                onPress={() => setFilterScriptType('kanji')}
                className={`flex-1 rounded-xl border-2 p-3 ${
                  filterScriptType === 'kanji'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <Text className={`text-center text-sm font-medium ${
                  filterScriptType === 'kanji' ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  Kanji
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFilterScriptType('vocabulary')}
                className={`flex-1 rounded-xl border-2 p-3 ${
                  filterScriptType === 'vocabulary'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <Text className={`text-center text-sm font-medium ${
                  filterScriptType === 'vocabulary' ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  Vocabulary
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Items List */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-slate-900">
                {selectedLevel === 'all' ? 'All Items' : `${selectedLevel} Items`}
              </Text>
              <Text className="text-sm text-slate-500">
                {filteredStats.length} item{filteredStats.length !== 1 ? 's' : ''}
              </Text>
            </View>

            {filteredStats.length === 0 ? (
              <View className="rounded-2xl border border-slate-200 bg-slate-50 p-6 items-center">
                <Text className="text-4xl mb-3">🎯</Text>
                <Text className="text-lg font-semibold text-slate-900 mb-1">
                  No Data for Selected Filters
                </Text>
                <Text className="text-center text-sm text-slate-500">
                  Try adjusting your filters to see more results.
                </Text>
              </View>
            ) : (
              filteredStats.map((stat) => (
                <JLPTItemCard key={`${stat.character}-${stat.jlptLevel}-${stat.scriptType}`} stat={stat} />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function JLPTItemCard({ stat }: { stat: CharacterStats }) {
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
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {stat.jlptLevel || 'N/A'}
              </Text>
              <Text className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                {stat.scriptType === 'kanji' ? 'Kanji' : 'Vocab'}
              </Text>
            </View>
            {stat.readingType && (
              <Text className="text-xs text-slate-500 mt-1">
                {stat.readingType === 'onyomi' ? '音読み' : '訓読み'}
              </Text>
            )}
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
          <Text className="text-xs text-slate-500">Attempts</Text>
          <Text className="text-sm font-medium text-slate-700">
            {stat.totalAttempts}
          </Text>
        </View>
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
