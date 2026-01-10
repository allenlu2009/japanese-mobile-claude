import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { getTests } from '../../lib/storage/testStorage';
import { getStreak } from '../../lib/storage/streakStorage';
import type { Test } from '../../lib/types';

export default function AnalyticsScreen() {
  const [tests, setTests] = useState<Test[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [testsData, streakData] = await Promise.all([
        getTests(),
        getStreak()
      ]);
      setTests(testsData);
      setStreak(streakData.currentStreak);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-slate-500">Loading analytics...</Text>
      </SafeAreaView>
    );
  }

  const totalTests = tests.length;
  const averageScore = totalTests > 0
    ? Math.round(tests.reduce((sum, t) => sum + t.score, 0) / totalTests)
    : 0;

  const testsByType = tests.reduce((acc, test) => {
    acc[test.testType] = (acc[test.testType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentTests = tests.slice(0, 10);

  const last7Days = tests.filter(t => {
    const daysDiff = (Date.now() - t.date) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  });

  const last30Days = tests.filter(t => {
    const daysDiff = (Date.now() - t.date) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="gap-6 px-6 py-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Analytics
            </Text>
            <Text className="text-3xl font-semibold text-slate-900">
              Your Progress
            </Text>
          </View>

          {/* Streak */}
          {streak > 0 && (
            <View className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm text-slate-600 mb-1">
                    Current Streak
                  </Text>
                  <Text className="text-4xl font-bold text-orange-500">
                    {streak} days 🔥
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Overall Stats */}
          <View className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
            <Text className="text-sm font-semibold text-slate-600 mb-4">
              Overall Statistics
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-3xl font-bold text-slate-900">{totalTests}</Text>
                <Text className="text-sm text-slate-500 mt-1">Total Tests</Text>
              </View>
              <View className="items-center">
                <Text className="text-3xl font-bold text-blue-500">{averageScore}%</Text>
                <Text className="text-sm text-slate-500 mt-1">Avg Score</Text>
              </View>
            </View>
          </View>

          {/* Activity Stats */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-slate-900">
              Activity
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-2xl border border-slate-200 bg-white p-4">
                <Text className="text-2xl font-bold text-slate-900">
                  {last7Days.length}
                </Text>
                <Text className="text-sm text-slate-500 mt-1">
                  Last 7 days
                </Text>
              </View>
              <View className="flex-1 rounded-2xl border border-slate-200 bg-white p-4">
                <Text className="text-2xl font-bold text-slate-900">
                  {last30Days.length}
                </Text>
                <Text className="text-sm text-slate-500 mt-1">
                  Last 30 days
                </Text>
              </View>
            </View>
          </View>

          {/* Tests by Type */}
          {Object.keys(testsByType).length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-slate-900">
                Tests by Type
              </Text>
              <View className="rounded-2xl border border-slate-200 bg-white p-4">
                {Object.entries(testsByType).map(([type, count]) => {
                  const percentage = Math.round((count / totalTests) * 100);
                  return (
                    <View key={type} className="mb-4 last:mb-0">
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-sm font-medium text-slate-700">
                          {type}
                        </Text>
                        <Text className="text-sm text-slate-500">
                          {count} tests ({percentage}%)
                        </Text>
                      </View>
                      <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <View
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Recent Tests */}
          {recentTests.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-slate-900">
                Recent Tests
              </Text>
              {recentTests.map((test) => (
                <View
                  key={test.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-slate-700">
                        {test.testType}
                      </Text>
                      <Text className="text-xs text-slate-500 mt-1">
                        {new Date(test.date).toLocaleDateString()} at {new Date(test.date).toLocaleTimeString()}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className={`text-2xl font-bold ${
                        test.score >= 90 ? 'text-green-500' :
                        test.score >= 70 ? 'text-blue-500' :
                        test.score >= 50 ? 'text-orange-500' :
                        'text-red-500'
                      }`}>
                        {test.score}%
                      </Text>
                      <Text className="text-xs text-slate-500">
                        {test.numQuestions} questions
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Empty State */}
          {totalTests === 0 && (
            <View className="items-center py-12">
              <Text className="text-6xl mb-4">📊</Text>
              <Text className="text-lg font-semibold text-slate-900 mb-2">
                No data yet
              </Text>
              <Text className="text-center text-slate-500">
                Complete some tests to see your analytics
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
