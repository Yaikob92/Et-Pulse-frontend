import { View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
    const router = useRouter();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black">Settings</Text>
                <View className="w-12" />
            </View>

            {/* Content */}
            <View className="flex-1 bg-gray-100 rounded-2xl p-4 pt-6 gap-6">
                {/* Card 1 */}
                <View className="bg-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
                        <Text className="text-lg text-gray-900 ">Preferences</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
                        <Text className="text-lg text-gray-900 ">Privacy</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
                        <Text className="text-lg text-gray-900 ">Account Management</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
                        <Text className="text-lg text-gray-900 ">Search History</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
                        <Text className="text-lg text-gray-900 ">List Project</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Card 2 */}
                <View className="bg-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center px-5 py-4">
                            <Text className="text-lg text-gray-900 font-medium">Notifications</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: "#767577", true: "#2563EB" }}
                            thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
                        />
                    </View>

                    <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
                        <Text className="text-lg text-gray-900 ">Video Quality</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
                        <Text className="text-lg text-gray-900 ">Favorites</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Dark Mode */}
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center px-5 py-4">
                            <Text className="text-lg text-gray-900 font-medium">Theme Mode</Text>
                        </View>
                        <Switch
                            value={darkModeEnabled}
                            onValueChange={setDarkModeEnabled}
                            trackColor={{ false: "#767577", true: "#7C3AED" }}
                            thumbColor={darkModeEnabled ? "#fff" : "#f4f3f4"}
                        />
                    </View>

                    <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
                        <Text className="text-lg text-gray-900 ">Sensetive Content Preferencces</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <View className="bg-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
                        <Text className="text-lg text-gray-900 ">About Us</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
