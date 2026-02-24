import BookMark from "@/components/BookMark";
import { Text, View, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";

const categories = ["All", "Politics", "Sports", "Business", "Tech", "Entertainment"];

export default function Bookmarks() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showMenu, setShowMenu] = useState(false);

    const menuOptions = [
        {
            label: "Mark all as read",
            icon: "checkmark-done-outline",
            onPress: () => Alert.alert("Success", "All bookmarks marked as read")
        },
        {
            label: "Sort by Date",
            icon: "calendar-outline",
            onPress: () => console.log("Sort by date")
        },
        {
            label: "Clear All",
            icon: "trash-outline",
            isDestructive: true,
            onPress: () => Alert.alert("Clear all", "Remove all bookmarks?", [{ text: "Cancel" }, { text: "Clear", style: 'destructive' }])
        },
    ];

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-white px-5 pt-12 pb-4 z-50">
                <View className="flex-row items-center justify-between mb-6 relative">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-[#1A1A1A]">Bookmarks</Text>

                    <View>
                        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
                            <Ionicons name="ellipsis-horizontal" size={24} color="#1A1A1A" />
                        </TouchableOpacity>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <View
                                className="absolute right-0 top-10 bg-white shadow-2xl shadow-black/20 rounded-2xl border border-gray-100 py-2 w-48 z-[100]"
                                style={{
                                    elevation: 5,
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 10 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 20,
                                }}
                            >
                                {menuOptions.map((option, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => {
                                            setShowMenu(false);
                                            option.onPress();
                                        }}
                                        className={`flex-row items-center px-4 py-3 ${idx !== menuOptions.length - 1 ? 'border-b border-gray-50' : ''}`}
                                    >
                                        <Ionicons
                                            name={option.icon as any}
                                            size={18}
                                            color={option.isDestructive ? "#EF4444" : "#4B5563"}
                                        />
                                        <Text className={`ml-3 font-medium ${option.isDestructive ? 'text-red-500' : 'text-gray-700'}`}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* Dismiss Menu Overlay */}
                {showMenu && (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setShowMenu(false)}
                        className="absolute top-0 left-0 right-0 bottom-[-1000] z-[90]"
                    />
                )}

                {/* Search Bar */}
                <View className="flex-row items-center bg-[#F1F3F5] rounded-full px-4 h-12 mb-6">
                    <Ionicons name="search-outline" size={20} color="#8E8E93" />
                    <TextInput
                        placeholder="Search saved articles"
                        className="flex-1 ml-3 text-base text-[#1A1A1A]"
                        placeholderTextColor="#8E8E93"
                    />
                </View>

                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            onPress={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === category ? "bg-black" : "bg-gray-100"
                                }`}
                        >
                            <Text
                                className={`${selectedCategory === category ? "text-white" : "text-black"
                                    } font-medium`}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Content */}
            <View className="flex-1">
                <BookMark />
            </View>
        </View>
    );
}
