import { useCurrentUser } from "@/hooks/useCurrrentUser";
import { useFetchNews } from "@/hooks/useNews";
import { NewsItem } from "@/types";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NewsItemCard } from "./NewsItemCard";

const NewsList = () => {
  const { currentUser } = useCurrentUser();
  const { news, isLoading, isError, refetch, toggleLike, checkIsLiked } =
    useFetchNews();

  const renderItem = useCallback<ListRenderItem<NewsItem>>(
    ({ item }) => (
      <NewsItemCard
        item={item}
        onLike={toggleLike}
        currentUser={currentUser}
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
    <FlatList
      data={news}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-24"
    // onRefresh={() => fetchNews(1, true)}
    // refreshing={refreshing}
    // onEndReached={() => {
    //   if (hasMore && !loading) {
    //     fetchNews(page + 1);
    //   }
    // }}
    // onEndReachedThreshold={0.5}
    // ListFooterComponent={
    //   loading && !refreshing ? (
    //     <View className="py-4">
    //       <ActivityIndicator size="small" color="#3B82F6" />
    //     </View>
    //   ) : null
    // }
    />
  );
};
export default NewsList;
