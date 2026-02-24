import { Text, View, TextInput, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/theme";

const trendingTopics = [
    { id: "1", title: "#EthiopiaEconomy", posts: "12.4K news" },
    { id: "2", title: "#AFCON2025", posts: "8.2K news" },
    { id: "3", title: "#TechFuture", posts: "5.1K news" },
    { id: "4", title: "#AddisAbaba", posts: "15.9K news" },
];

const categories = ["Trending", "Politics", "Sports", "Business", "Tech", "Life Style"];

export default function Explore() {
    const [selectedCategory, setSelectedCategory] = useState("Trending");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
            {/* Search Header */}
            <View className="px-6 py-4">
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 h-12">
                    <Feather name="search" size={20} color={COLORS.grey} />
                    <TextInput
                        placeholder="Search news, topics, or channels"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 ml-3 text-base text-gray-900"
                        placeholderTextColor={COLORS.grey}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Categories Horizontal */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-6 mb-6"
                    contentContainerStyle={{ paddingRight: 40 }}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            onPress={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full mr-2 ${selectedCategory === category ? "bg-black" : "bg-gray-100"}`}
                        >
                            <Text className={`${selectedCategory === category ? "text-white" : "text-gray-600"} font-semibold`}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Featured Section */}
                <View className="px-6 mb-8">
                    <View className="bg-blue-600 rounded-3xl p-6 relative overflow-hidden">
                        <View className="z-10">
                            <Text className="text-blue-100 font-bold uppercase tracking-widest text-xs mb-2">Featured Topic</Text>
                            <Text className="text-white text-2xl font-bold mb-4">The Future of AI in{"\n"}East Africa</Text>
                            <TouchableOpacity className="bg-white self-start px-6 py-2 rounded-full">
                                <Text className="text-blue-600 font-bold">Explore</Text>
                            </TouchableOpacity>
                        </View>
                        <MaterialCommunityIcons
                            name="robot"
                            size={120}
                            color="white"
                            style={{ position: "absolute", right: -20, bottom: -20, opacity: 0.1 }}
                        />
                    </View>
                </View>

                {/* Trending Section */}
                <View className="px-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xl font-bold text-gray-900">Trending for you</Text>
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-semibold">See all</Text>
                        </TouchableOpacity>
                    </View>

                    {trendingTopics.map((topic) => (
                        <TouchableOpacity key={topic.id} className="flex-row items-center justify-between py-4 border-b border-gray-50">
                            <View>
                                <Text className="text-[17px] font-bold text-gray-900 mb-1">{topic.title}</Text>
                                <Text className="text-sm text-gray-500">{topic.posts} posts</Text>
                            </View>
                            <Ionicons name="trending-up" size={20} color="#10B981" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Suggested Channels */}
                <View className="px-6 mt-8 mb-10">
                    <Text className="text-xl font-bold text-gray-900 mb-4">Discover Channels</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
                        {[1, 2, 3].map((i) => (
                            <View key={i} className="bg-gray-50 rounded-2xl p-4 w-40 mr-4 items-center">
                                <View className="w-16 h-16 rounded-full bg-gray-200 mb-3 overflow-hidden">
                                    <Image
                                        source={{ uri: `https://ui-avatars.com/api/?name=Channel+${i}&background=random` }}
                                        className="w-full h-full"
                                    />
                                </View>
                                <Text className="font-bold text-gray-900 text-center" numberOfLines={1}>News Channel {i}</Text>
                                <Text className="text-xs text-gray-500 mb-3">12.5K Followers</Text>
                                <TouchableOpacity className="bg-black px-4 py-1.5 rounded-full w-full">
                                    <Text className="text-white text-xs font-bold text-center">Follow</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
