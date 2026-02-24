import { useUserSync } from "@/hooks/useUserSync";
import { Feather, Ionicons } from "@expo/vector-icons";
import NewsList from "@/components/NewsList";
import { useState } from "react";
import { TextInput, View, ScrollView, TouchableOpacity, Text, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useTheme } from "@/context/ThemeContext";

const categories = ["All", "Politics", "Sports", "Business", "Tech", "Entertainment"];

export default function HomeScreen() {
  const { currentUser } = useCurrentUser();
  const router = useRouter();
  const { isDark } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const { newsId } = useLocalSearchParams<{ newsId: string }>();
  useUserSync();

  return (
    <View className="flex-1 bg-gray-100 dark:bg-[#0F1117]">
      {/* Header Area */}
      <View className="bg-white dark:bg-[#1A1D27] px-4 pt-3 pb-2">
        <View className="flex-row items-center">
          {/* Profile Picture */}
          <TouchableOpacity
            className="mr-3"
            onPress={() => router.push("/profile")}
          >
            <Image
              source={{
                uri: currentUser?.profilePicture || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff",
              }}
              className="w-10 h-10 rounded-full"
            />
          </TouchableOpacity>

          {/* Search Bar */}
          <View className="flex-1 flex-row items-center bg-[#F1F3F5] dark:bg-[#252830] rounded-full px-4 h-11">
            <Feather name="search" size={20} color={isDark ? "#9CA3AF" : "#657786"} />
            <TextInput
              placeholder="Search News"
              className="flex-1 ml-2 text-base h-full text-gray-900 dark:text-gray-100"
              placeholderTextColor={isDark ? "#6B7280" : "#657786"}
            />
          </View>

          {/* Notification */}
          <TouchableOpacity
            className="ml-3 p-2 bg-[#F1F3F5] dark:bg-[#252830] rounded-full"
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={22} color={isDark ? "#D1D5DB" : "#374151"} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === category
                ? "bg-black dark:bg-blue-600"
                : "bg-gray-200 dark:bg-[#252830]"
                }`}
            >
              <Text
                className={`${selectedCategory === category
                  ? "text-white"
                  : "text-black dark:text-gray-300"
                  } font-medium`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* News List */}
      <NewsList category={selectedCategory} newsId={newsId} />
    </View>
  );
}
