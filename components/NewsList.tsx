import { useFetchNews } from "@/hooks/useNews";
import { NewsItem } from "@/types";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { NewsItemCard } from "./NewsItemCard";

const NewsList = () => {
  const { news, isLoading, isError, data, error, refetch } = useFetchNews();

  if (isLoading) {
    return (
      <View className="p-8 items-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
        <Text className="text-gray-500 mt-2">Loading posts....</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500 mb-4">Failed to load posts</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => refetch()}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (news.lenght === 0) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500">No posts yet</Text>
      </View>
    );
  }

  return (
    <>
      {news?.map((item: NewsItem) => (
        <NewsItemCard key={item._id} item={item} />
      ))}
    </>
  );
};
