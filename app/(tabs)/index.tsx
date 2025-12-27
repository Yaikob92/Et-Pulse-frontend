import { API_URL } from "@/constants/api";
import { useSignOut } from "@/hooks/useSignOut";
import { useUserSync } from "@/hooks/useUserSync";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewsList() {
  useUserSync();
  // const renderItem: ListRenderItem<NewsItem> = ({ item }) => {
  //   return (
  //     <NewsItemCard
  //       item={item}
  //       isExpanded={expandedItems.has(item._id)}
  //       isLiked={likedItems.has(item._id)}
  //       isBookmarked={bookmarkedItems.has(item._id)}
  //       onToggleExpanded={() => toggleExpanded(item._id)}
  //       onToggleLike={() => toggleLike(item._id)}
  //       onToggleBookmark={() => toggleBookmark(item._id)}
  //     />
  //   );
  // };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="px-4 py-3 mx-3 border-b border-gray-200">
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
      {/* <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-24"
        onRefresh={() => fetchNews(1, true)}
        refreshing={refreshing}
        onEndReached={() => {
          if (hasMore && !loading) {
            fetchNews(page + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && !refreshing ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#3B82F6" />
            </View>
          ) : null
        }
      /> */}
    </View>
  );
}

//  const toggleExpanded = (id: string) => {
//     setExpandedItems((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });
//   };
