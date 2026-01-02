import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFetchNews } from "@/hooks/useNews";
import { NewsItem } from "@/types";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NewsItemCard } from "./NewsItemCard";
import CommentsModal from "@/components/CommentsModal";
const NewsList = () => {
  const { currentUser } = useCurrentUser();
  const { news, isLoading, isError, refetch, toggleLike, checkIsLiked } =
    useFetchNews();

  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  const selectedNews = selectedNewsId
    ? news.find((n: NewsItem) => n._id === selectedNewsId)
    : null;

  const renderNews = useCallback<ListRenderItem<NewsItem>>(
    ({ item }) => (
      <NewsItemCard
        item={item}
        onLike={toggleLike}
        currentUser={currentUser}
        onComment={() => setSelectedNewsId(item._id)}
        isLiked={checkIsLiked(item.likes, currentUser)}
      />
    ),
    [toggleLike, currentUser, checkIsLiked]
  );

  if (isLoading) {
    return (
      <View className="p-8 items-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
        <Text className="text-gray-500 mt-2">Loading posts....</Text>
      </View>
    );
  }

  if (isError) {
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

  if (news.length === 0) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500">No posts yet</Text>
      </View>
    );
  }
  return (
    <>
      <FlatList
        data={news}
        renderItem={renderNews}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-24"
      />
      <CommentsModal
        selectedNews={selectedNews}
        onClose={() => setSelectedNewsId(null)}
      />
    </>
  );
};
export default NewsList;
