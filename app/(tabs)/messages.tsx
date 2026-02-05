import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const MessagesComingSoon = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center mb-6">
          <Ionicons name="chatbubbles-outline" size={48} color="#2563eb" />
        </View>

        <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
          Messages Coming Soon
        </Text>

        <Text className="text-base text-gray-500 text-center leading-6">
          We're working hard to bring you a seamless messaging experience. Stay tuned for updates!
        </Text>

        <View className="mt-10 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
          <Text className="text-gray-400 font-medium italic">
            #BuildingTheFuture
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MessagesComingSoon;
