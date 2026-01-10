import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { getTests } from '../../lib/storage/testStorage';
import { getStreak } from '../../lib/storage/streakStorage';
import type { Test } from '../../lib/types';

export default function PracticeScreen() {
  const [recentTests, setRecentTests] = useState<Test[]>([]);
  const [streak, setStreak] = useState(0);
  const [selectedType, setSelectedType] = useState<'Hiragana' | 'Katakana' | 'Kanji' | 'Vocabulary'>('Hiragana');
  const [numQuestions, setNumQuestions] = useState('10');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [tests, streakData] = await Promise.all([
        getTests(),
        getStreak()
      ]);
      setRecentTests(tests.slice(0, 3));
      setStreak(streakData.currentStreak);
    } catch (error) {
      console.error('Failed to load practice data:', error);
    }
  }

  function startTest() {
    const questions = parseInt(numQuestions) || 10;
    router.push({
      pathname: '/test/[type]',
      params: { type: selectedType.toLowerCase(), questions }
    });
  }

  const testTypes = [
    { name: 'Hiragana', emoji: 'あ', color: 'bg-blue-500' },
    { name: 'Katakana', emoji: 'ア', color: 'bg-purple-500' },
    { name: 'Kanji', emoji: '漢', color: 'bg-green-500' },
    { name: 'Vocabulary', emoji: '語', color: 'bg-orange-500' }
  ] as const;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="gap-6 px-6 py-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Practice
            </Text>
            <Text className="text-3xl font-semibold text-slate-900">
              Start Learning
            </Text>
            {streak > 0 && (
              <View className="flex-row items-center gap-2">
                <Text className="text-2xl">🔥</Text>
                <Text className="text-lg font-semibold text-orange-500">
                  {streak} day streak
                </Text>
              </View>
            )}
          </View>

          {/* Test Type Selection */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-slate-700">
              Choose Test Type
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {testTypes.map((type) => (
                <TouchableOpacity
                  key={type.name}
                  onPress={() => setSelectedType(type.name)}
                  className={`flex-1 min-w-[45%] rounded-2xl p-4 ${
                    selectedType === type.name
                      ? type.color
                      : 'bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Text className="text-3xl text-center mb-1">{type.emoji}</Text>
                  <Text
                    className={`text-center font-semibold ${
                      selectedType === type.name ? 'text-white' : 'text-slate-700'
                    }`}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Number of Questions */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-slate-700">
              Number of Questions
            </Text>
            <View className="flex-row gap-3">
              {['5', '10', '20', '30'].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => setNumQuestions(num)}
                  className={`flex-1 rounded-xl p-3 ${
                    numQuestions === num
                      ? 'bg-blue-500'
                      : 'bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      numQuestions === num ? 'text-white' : 'text-slate-700'
                    }`}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              value={numQuestions}
              onChangeText={setNumQuestions}
              keyboardType="number-pad"
              placeholder="Custom"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-slate-900"
            />
          </View>

          {/* Start Button */}
          <TouchableOpacity
            onPress={startTest}
            className="rounded-2xl bg-blue-500 p-5 active:bg-blue-600"
          >
            <Text className="text-center text-lg font-semibold text-white">
              🎯 Start Test
            </Text>
          </TouchableOpacity>

          {/* Recent Tests */}
          {recentTests.length > 0 && (
            <View className="gap-3 mt-4">
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
                        {new Date(test.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-2xl font-bold text-slate-900">
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
