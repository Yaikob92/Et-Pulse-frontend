import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

const NotificationsScreen = () => {
    const router = useRouter();
    const { isDark } = useTheme();

    const notifications = [
        {
            id: "1",
            type: "like",
            user: "Abenezer",
            action: "liked your comment",
            time: "2h ago",
            icon: "heart",
            iconColor: "#EF4444",
            bg: "bg-red-50 dark:bg-red-900/30",
        },
        {
            id: "2",
            type: "comment",
            user: "Sara",
            action: "commented on your post",
            time: "5h ago",
            icon: "chatbubble",
            iconColor: "#3B82F6",
            bg: "bg-blue-50 dark:bg-blue-900/30",
        },
        {
            id: "3",
            type: "mention",
            user: "Dawit",
            action: "mentioned you in a post",
            time: "Yesterday",
            icon: "at",
            iconColor: "#10B981",
            bg: "bg-green-50 dark:bg-green-900/30",
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1117]">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A1D27]">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color={isDark ? "#D1D5DB" : "black"} />
                </TouchableOpacity>
                <Text className="text-xl font-bold ml-4 text-gray-900 dark:text-gray-100">Notifications</Text>
            </View>

            <ScrollView className="flex-1">
                {notifications.length > 0 ? (
                    notifications.map((item) => (
                        <TouchableOpacity key={item.id} className="flex-row items-center px-4 py-4 border-b border-gray-50 dark:border-gray-800">
                            <View className={`w-12 h-12 ${item.bg} rounded-full items-center justify-center mr-4`}>
                                <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 dark:text-gray-200 leading-5">
                                    <Text className="font-bold">{item.user}</Text> {item.action}
                                </Text>
                                <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1">{item.time}</Text>
                            </View>
                            <View className="w-2 h-2 bg-blue-500 rounded-full" />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View className="flex-1 items-center justify-center py-20">
                        <Ionicons name="notifications-off-outline" size={64} color={isDark ? "#374151" : "#e5e7eb"} />
                        <Text className="text-gray-500 dark:text-gray-400 mt-4">No notifications yet</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default NotificationsScreen;
