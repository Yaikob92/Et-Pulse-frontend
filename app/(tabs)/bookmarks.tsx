import BookMark from "@/components/BookMark";
import { Text, View, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";



const categories = ["All", "Politics", "Sports", "Business", "Tech", "Entertainment"];

export default function Bookmarks() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="bg-white px-5 pt-8 pb-4">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-[#1A1A1A]">Bookmarks</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-[#F1F3F5] rounded-full px-4 py-1 mb-6">
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

      {/* Content */}
      <View className="flex-1">
        <BookMark />
      </View>
    </View>
  );
}
