import { View, Text, SafeAreaView } from 'react-native';

export default function AnalyticsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        <Text className="text-3xl font-bold text-slate-900">
          Analytics
        </Text>
        <Text className="mt-2 text-base text-slate-500">
          Character analytics coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
}
