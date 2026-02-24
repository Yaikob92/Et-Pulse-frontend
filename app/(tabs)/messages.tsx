import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

const MessagesComingSoon = () => {
  const { isDark } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1117]">
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center mb-6">
          <Ionicons name="chatbubbles-outline" size={48} color="#2563eb" />
        </View>

        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-3">
          Messages Coming Soon
        </Text>

        <Text className="text-base text-gray-500 dark:text-gray-400 text-center leading-6">
          We're working hard to bring you a seamless messaging experience. Stay tuned for updates!
        </Text>

        <View className="mt-10 px-6 py-3 bg-gray-50 dark:bg-[#1A1D27] rounded-2xl border border-gray-100 dark:border-gray-700">
          <Text className="text-gray-400 dark:text-gray-500 font-medium italic">
            #BuildingTheFuture
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MessagesComingSoon;
