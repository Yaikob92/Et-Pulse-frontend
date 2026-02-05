import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const NotificationsScreen = () => {
    const router = useRouter();

    const notifications = [
        {
            id: "1",
            type: "like",
            user: "Abenezer",
            action: "liked your comment",
            time: "2h ago",
            icon: "heart",
            color: "text-red-500",
            bg: "bg-red-50",
        },
        {
            id: "2",
            type: "comment",
            user: "Sara",
            action: "commented on your post",
            time: "5h ago",
            icon: "chatbubble",
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            id: "3",
            type: "mention",
            user: "Dawit",
            action: "mentioned you in a post",
            time: "Yesterday",
            icon: "at",
            color: "text-green-500",
            bg: "bg-green-50",
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold ml-4">Notifications</Text>
            </View>

            <ScrollView className="flex-1">
                {notifications.length > 0 ? (
                    notifications.map((item) => (
                        <TouchableOpacity key={item.id} className="flex-row items-center px-4 py-4 border-b border-gray-50">
                            <View className={`w-12 h-12 ${item.bg} rounded-full items-center justify-center mr-4`}>
                                <Ionicons name={item.icon as any} size={24} className={item.color} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 leading-5">
                                    <Text className="font-bold">{item.user}</Text> {item.action}
                                </Text>
                                <Text className="text-gray-500 text-xs mt-1">{item.time}</Text>
                            </View>
                            <View className="w-2 h-2 bg-blue-500 rounded-full" />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View className="flex-1 items-center justify-center py-20">
                        <Ionicons name="notifications-off-outline" size={64} color="#e5e7eb" />
                        <Text className="text-gray-500 mt-4">No notifications yet</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default NotificationsScreen;
