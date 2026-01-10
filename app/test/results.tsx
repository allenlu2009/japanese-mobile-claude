import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const score = parseInt(params.score as string || '0');
  const total = parseInt(params.total as string || '0');
  const correct = parseInt(params.correct as string || '0');
  const testType = params.testType as string || 'Test';

  const percentage = Math.round((correct / total) * 100);
  const incorrect = total - correct;

  function getScoreColor() {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 70) return 'text-blue-500';
    if (percentage >= 50) return 'text-orange-500';
    return 'text-red-500';
  }

  function getScoreEmoji() {
    if (percentage >= 90) return '🎉';
    if (percentage >= 70) return '👏';
    if (percentage >= 50) return '👍';
    return '💪';
  }

  function getMessage() {
    if (percentage >= 90) return 'Excellent work!';
    if (percentage >= 70) return 'Great job!';
    if (percentage >= 50) return 'Good effort!';
    return 'Keep practicing!';
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="gap-8 px-6 py-12">
          {/* Header */}
          <View className="items-center gap-4">
            <Text className="text-6xl">{getScoreEmoji()}</Text>
            <View className="items-center gap-2">
              <Text className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Test Complete
              </Text>
              <Text className="text-3xl font-semibold text-slate-900">
                {getMessage()}
              </Text>
            </View>
          </View>

          {/* Score Circle */}
          <View className="items-center">
            <View className="h-48 w-48 items-center justify-center rounded-full border-8 border-slate-100 bg-white">
              <Text className={`text-5xl font-bold ${getScoreColor()}`}>
                {percentage}%
              </Text>
              <Text className="text-sm text-slate-500 mt-1">
                {correct}/{total} correct
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View className="gap-3">
            <View className="rounded-2xl border border-slate-200 bg-white p-6">
              <Text className="text-sm font-semibold text-slate-600 mb-4">
                Test Statistics
              </Text>

              <View className="gap-3">
                <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
                  <Text className="text-slate-600">Test Type</Text>
                  <Text className="font-semibold text-slate-900">
                    {testType.charAt(0).toUpperCase() + testType.slice(1)}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
                  <Text className="text-slate-600">Total Questions</Text>
                  <Text className="font-semibold text-slate-900">{total}</Text>
                </View>

                <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
                  <Text className="text-green-600">✓ Correct</Text>
                  <Text className="font-semibold text-green-600">{correct}</Text>
                </View>

                <View className="flex-row justify-between items-center py-2">
                  <Text className="text-red-600">✗ Incorrect</Text>
                  <Text className="font-semibold text-red-600">{incorrect}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={() => router.replace('/')}
              className="rounded-2xl bg-blue-500 p-5 active:bg-blue-600"
            >
              <Text className="text-center text-lg font-semibold text-white">
                🎯 Take Another Test
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace('/analytics')}
              className="rounded-2xl border-2 border-blue-500 bg-white p-5 active:bg-blue-50"
            >
              <Text className="text-center text-lg font-semibold text-blue-500">
                📊 View Analytics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace('/')}
              className="rounded-2xl bg-slate-100 p-4 active:bg-slate-200"
            >
              <Text className="text-center font-semibold text-slate-600">
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
