import BookMark from "@/components/BookMark";
import { Text, View } from "react-native";

export default function Bookmarks() {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-200">
        <Text className="text-xl font-semibold text-gray-900">
          Your Bookmarks
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          News you saved to read later
        </Text>
      </View>

      {/* Content */}
      <BookMark />
    </View>
  );
}
