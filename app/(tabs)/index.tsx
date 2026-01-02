import { useUserSync } from "@/hooks/useUserSync";
import { Feather } from "@expo/vector-icons";
import NewsList from "@/components/NewsList";

import { TextInput, View } from "react-native";
export default function HomeScreen() {
  useUserSync();

  return (
    <View className="flex-1 bg-gray-100">
      {/* Search Bar */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-full border border-black px-4 ">
          <Feather name="search" size={20} color="#657786" />
          <TextInput
            placeholder="Search News"
            className="flex-1 ml-2 text-base"
            placeholderTextColor="#657786"
          />
        </View>
      </View>

      {/* News List */}
      <NewsList />
    </View>
  );
}
