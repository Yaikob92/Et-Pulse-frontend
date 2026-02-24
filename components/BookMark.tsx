import {
  View,
  Text,
  ListRenderItem,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useCallback, useState } from "react";
import { NewsItem } from "@/types";

import { useBookmarks } from "@/hooks/useBookmarks";
import { BookMarkCards } from "./BookMarkCards";
import { useRouter } from "expo-router";
import { BookMarkListSkeleton } from "./NewsItemSkeleton";

const BookMark = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { news, isLoading, isError, refetch, saveBookMark } = useBookmarks();
  const router = useRouter();

  const renderBookMarks = useCallback<ListRenderItem<NewsItem>>(
    ({ item }) => (
      <BookMarkCards
        item={item}
        onRemove={saveBookMark}
        onPress={() => router.push({ pathname: "/", params: { newsId: item._id } })}
      />
    ),
    [saveBookMark, router],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return <BookMarkListSkeleton />;
  }

  if (isError) {
    return (
      <View className="p-8 items-center">
        <Text className="text-gray-500 dark:text-gray-400 mb-4">Failed to load bookmarks</Text>
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
        <Text className="text-gray-500 dark:text-gray-400">No bookmarks yet</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-[#0F1117]">
      <FlatList
        data={news}
        renderItem={renderBookMarks}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1DA1F2"
            colors={["#1DA1F2"]}
          />
        }
      />
    </View>
  );
};

export default BookMark;
