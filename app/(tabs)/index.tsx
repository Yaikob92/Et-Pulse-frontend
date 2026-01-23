import { useUserSync } from "@/hooks/useUserSync";
import { Feather } from "@expo/vector-icons";
import NewsList from "@/components/NewsList";
import { useState } from "react";
import { TextInput, View, ScrollView, TouchableOpacity, Text } from "react-native";

const categories = ["All", "Politics", "Sports", "Business", "Tech", "Entertainment"];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  useUserSync();

  return (
    <View className="flex-1 bg-gray-100">
      {/* Search Bar */}
      <View className="px-4 py-3 bg-white">
        <View className="flex-row items-center bg-gray-100 rounded-full border border-black px-4 ">
          <Feather name="search" size={20} color="#657786" />
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
      <NewsList category={selectedCategory} />
    </View>
  );
}
