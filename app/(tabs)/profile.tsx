import React from "react";
import { View } from "react-native";
import Profile from "@/components/Profile";

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-white dark:bg-[#0F1117]">
      <Profile />
    </View>
  );
}
