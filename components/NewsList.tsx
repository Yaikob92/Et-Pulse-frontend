import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFetchNews } from "@/hooks/useNews";
import { NewsItem } from "@/types";
import { useCallback, useState, useEffect, useRef } from "react";
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NewsItemCard } from "./NewsItemCard";
import CommentsModal from "@/components/CommentsModal";
import { useBookmarks } from "@/hooks/useBookmarks";

import { NewsListSkeleton } from "./NewsItemSkeleton";

interface NewsListProps {
  category?: string;
  newsId?: string;
}

const NewsList = ({ category, newsId }: NewsListProps) => {
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const { news, isLoading: newsLoading, isError, refetch, toggleLike } =
    useFetchNews();
  const { saveBookMark, checkIsBookmarked } = useBookmarks();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (newsId && news && news.length > 0) {
      const index = news.findIndex((item: NewsItem) => item._id === newsId);
      if (index !== -1) {
        // Use a small timeout to ensure the list is rendered
        const timer = setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0,
          });
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [newsId, news]);

  const selectedNews = selectedNewsId
    ? news.find((n: NewsItem) => n._id === selectedNewsId)
    : null;

  const handleToggleLike = (newsId: string) => {
    if (!currentUser) {
      alert("Please log in to like posts.");
      return;
    }
    toggleLike(newsId);
  };

  const handleToggleBookmark = (newsId: string) => {
    if (!currentUser) {
      alert("Please log in to bookmark news.");
      return;
    }
    saveBookMark(newsId);
  };

  const renderNews = useCallback<ListRenderItem<NewsItem>>(
    ({ item }) => (
      <NewsItemCard
        item={item}
        onLike={handleToggleLike}
        currentUser={currentUser}
        onComment={() => setSelectedNewsId(item._id)}
        isBookmarked={checkIsBookmarked(item._id)}
        onBookmark={handleToggleBookmark}
        isLiked={item.isLiked}
      />
    ),
    [handleToggleLike, currentUser, handleToggleBookmark, checkIsBookmarked],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  if (userLoading || newsLoading) {
    return <NewsListSkeleton />;
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
        ref={flatListRef}
        data={news}
        renderItem={renderNews}
        keyExtractor={(item) => item._id}
        extraData={news}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1DA1F2"
            colors={["#1DA1F2"]}
          />
        }
      />
      <CommentsModal
        selectedNews={selectedNews}
        onClose={() => setSelectedNewsId(null)}
      />
    </>
  );
};
export default NewsList;
