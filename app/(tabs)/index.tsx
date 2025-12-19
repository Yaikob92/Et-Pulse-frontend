import { API_URL } from "@/constants/api";
import { useSignOut } from "@/hooks/useSignOut";
import { Ionicons } from "@expo/vector-icons";
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
  // const{token} = useAuthStore()

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const { handleSignOut } = useSignOut();


  //  headers:{Authorization:`Bearer ${token}`}
  const fetchNews = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await fetch(`${API_URL}news?page=${pageNum}&limit=10`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch news");

      // setNews((prevNews) => [...prevNews, ...data.news]);
      const uniqueNews =
        refresh || pageNum === 1
          ? data.news
          : Array.from(new Set([...news, ...data.news].map((n) => n._id))).map(
            (id) => [...news, ...data.news].find((n) => n._id === id)
          );

      setNews(uniqueNews);

      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log("Error fetching news", error);
    } finally {
      if (refresh) {
        setRefreshing(false);
      } else setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  interface NewsItem {
    _id: string;
    channelProfilePic: string;
    channelUsername: string;
    publishedAt: string;
    content?: string;
    mediaUrl?: string;
  }

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleLike = (id: string) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderItem: ListRenderItem<NewsItem> = ({ item }) => {
    const isExpanded = expandedItems.has(item._id);
    const isLiked = likedItems.has(item._id);
    const isBookmarked = bookmarkedItems.has(item._id);

    return (
      <View className="bg-white border-b border-gray-200 pb-4 mb-2">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 mb-3">
          <View className="flex-row items-center flex-1">
            <Image
              source={{ uri: item.channelProfilePic }}
              style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: "#F3F4F6" }}
            />
            <View className="ml-3 flex-1">
              <Text className="text-base font-bold text-gray-900 mb-0.5">
                {item.channelUsername}
              </Text>
              <Text className="text-[13px] text-gray-500 font-medium">
                {new Date(item.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        {item.content && (
          <View className="px-4 mb-3">
            <Text
              className="text-[15px] leading-[22px] text-gray-800 font-normal"
              numberOfLines={isExpanded ? undefined : 3}
              ellipsizeMode="tail"
            >
              {item.content}
            </Text>

            {item.content.length > 100 && (
              <TouchableOpacity onPress={() => toggleExpanded(item._id)}>
                <Text className="text-sm text-blue-600 font-semibold mt-1.5">
                  {isExpanded ? "Show less" : "Read more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Media */}
        {item.mediaUrl && (
          <View className="mb-4">
            <Image
              source={{ uri: item.mediaUrl }}
              style={{ width: "100%", height: 256, backgroundColor: "#F3F4F6" }}
              contentFit="cover"
            />
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row justify-between px-6 pt-2">
          <TouchableOpacity
            className="items-center gap-1"
            onPress={() => toggleLike(item._id)}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "#EF4444" : "#4B5563"}
            />
            <Text className={`text-xs font-medium ${isLiked ? "text-red-500" : "text-gray-600"}`}>
              {isLiked ? "Liked" : "Like"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center gap-1">
            <Ionicons name="chatbubble-outline" size={24} color="#4B5563" />
            <Text className="text-xs text-gray-600 font-medium">Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center gap-1">
            <Ionicons name="share-social-outline" size={24} color="#4B5563" />
            <Text className="text-xs text-gray-600 font-medium">Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center gap-1"
            onPress={() => toggleBookmark(item._id)}
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isBookmarked ? "#3B82F6" : "#4B5563"}
            />
            <Text className={`text-xs font-medium ${isBookmarked ? "text-blue-500" : "text-gray-600"}`}>
              {isBookmarked ? "Saved" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="flex-row items-center px-4 py-3 gap-3 bg-white border-b border-gray-200">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4 py-3 gap-2.5">
          <Ionicons name="search" size={20} color="black" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="black"
            style={{ flex: 1, fontSize: 15, color: "#9CA3AF", fontWeight: "normal" }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          onPress={handleSignOut}
          className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center border border-gray-200"
        >
          <Ionicons name="log-out-outline" size={22} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* News List */}
      <FlatList
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
      />
    </View>
  );
}
