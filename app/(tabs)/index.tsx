import { useUserSync } from "@/hooks/useUserSync";
import { Feather } from "@expo/vector-icons";
import NewsList from "@/components/NewsList";
import { useState } from "react";
import { TextInput, View, ScrollView, TouchableOpacity, Text, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const categories = ["All", "Politics", "Sports", "Business", "Tech", "Entertainment"];

export default function HomeScreen() {
  const { currentUser } = useCurrentUser();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const { newsId } = useLocalSearchParams<{ newsId: string }>();
  useUserSync();

  return (
    <View className="flex-1 bg-gray-100">
      {/* Search Bar */}
      <View className="px-4 py-3 bg-white">
        <View className="flex-row items-center bg-[#F1F3F5] rounded-full px-4 ">
          <Feather name="search" size={20} color="#6577zz86" />
          <TextInput
            placeholder="Search News"
            className="flex-1 ml-2 text-base"
            placeholderTextColor="#657786"
          />
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
              className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === category ? "bg-black" : "bg-gray-200"
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

      {/* News List */}
      <NewsList category={selectedCategory} newsId={newsId} />
    </View>
  );
}
