import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFetchNews } from "@/hooks/useNews";
import { NewsItem } from "@/types";
import { useCallback, useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
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
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

import { NewsListSkeleton } from "./NewsItemSkeleton";

interface NewsListProps {
  category?: string;
  newsId?: string;
  search?: string;
}

const NewsList = ({ category, newsId, search }: NewsListProps) => {
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const {
    news,
    isLoading: newsLoading,
    isError,
    refetch,
    toggleLike,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchNews(category, search);
  const { saveBookMark, checkIsBookmarked } = useBookmarks();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (newsId && news && news.length > 0) {
      const index = news.findIndex((item: NewsItem) => item._id === newsId);
      if (index !== -1) {
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

  const onScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 500 && !showScrollTop) {
      setShowScrollTop(true);
    } else if (offsetY <= 500 && showScrollTop) {
      setShowScrollTop(false);
    }
  }, [showScrollTop]);

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const selectedNews = selectedNewsId
    ? news.find((n: NewsItem) => n._id === selectedNewsId) ?? null
    : null;

  const handleToggleLike = useCallback((newsId: string) => {
    if (!currentUser) {
      alert("Please log in to like posts.");
      return;
    }
    toggleLike(newsId);
  }, [currentUser, toggleLike]);

  const handleToggleBookmark = useCallback((newsId: string) => {
    if (!currentUser) {
      alert("Please log in to bookmark news.");
      return;
    }
    saveBookMark(newsId);
  }, [currentUser, saveBookMark]);

  const handleComment = useCallback((item: NewsItem) => {
    setSelectedNewsId(item._id);
  }, []);

  const renderNews = useCallback<ListRenderItem<NewsItem>>(
    ({ item }) => (
      <NewsItemCard
        item={item}
        onLike={handleToggleLike}
        currentUser={currentUser}
        onComment={handleComment}
        isBookmarked={checkIsBookmarked(item._id)}
        onBookmark={handleToggleBookmark}
        isLiked={item.isLiked}
      />
    ),
    [handleToggleLike, currentUser, handleComment, handleToggleBookmark, checkIsBookmarked],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#1DA1F2" />
      </View>
    );
  };

  if (userLoading || newsLoading) {
    return <NewsListSkeleton />;
  }

  if (isError) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500 dark:text-gray-400 mb-4">Failed to load posts</Text>
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
        <Text className="text-gray-500 dark:text-gray-400">No posts yet</Text>
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
        extraData={[news, currentUser, isDark]} // Force re-render on theme change
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        
        // Performance Props
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={150}
        
        onScroll={onScroll}
        scrollEventThrottle={32} // Less sensitive checking for a smoother feel
        
        onEndReached={onEndReached}
        onEndReachedThreshold={0.7}
        ListFooterComponent={renderFooter}
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

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={scrollToTop}
          className="absolute bottom-24 right-6 bg-blue-600 w-12 h-12 rounded-full items-center justify-center shadow-lg elevation-5"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65 }}
        >
          <Ionicons name="arrow-up" size={24} color="white" />
        </TouchableOpacity>
      )}
    </>
  );
};
export default NewsList;
