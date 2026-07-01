import { useTheme } from "@/context/ThemeContext";
import { NewsItem, User } from "@/types";
import { formatDate, formatNumber } from "@/utils/formatter";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { memo, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type NewsCardProps = {
  item: NewsItem;
  onLike: (newsId: string) => void;
  isLiked?: boolean;
  onComment: (news: NewsItem) => void;
  currentUser: User;
  onBookmark: (newsId: string) => void;
  isBookmarked: boolean;
};

export const NewsItemCard = memo(({
  item,
  onLike,
  isLiked,
  onComment,
  currentUser,
  onBookmark,
  isBookmarked,
}: NewsCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const CONTENT_LIMIT = 150;
  const { isDark } = useTheme();

  const channel = typeof item.channel_id === "object" ? item.channel_id : null;
  const channelName = channel?.name || "";
  const channelUsername = channel?.username || "";
  const channelProfilePic = channel?.profile_pic || "https://ui-avatars.com/api/?name=Channel&background=0D8ABC&color=fff";

  const shouldTruncate = item.content && item.content.length > CONTENT_LIMIT;
  const displayText =
    shouldTruncate && !isExpanded
      ? `${item.content?.substring(0, CONTENT_LIMIT)}...`
      : item.content;

  return (
    <View className="bg-white dark:bg-[#1A1D27] border-b border-gray-400 dark:border-gray-700 pb-4 mb-3">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 mb-3">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: channelProfilePic }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: isDark ? "#374151" : "#F3F4F6",
            }}
          />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-gray-900 dark:text-gray-100">
              {(channelUsername || channelName || "").toUpperCase()}
            </Text>
            <Text className="text-[13px] text-gray-500 dark:text-gray-400">
              {formatDate(item.published_at || item.createdAt)}
            </Text>
          </View>
          <TouchableOpacity onPress={() => onBookmark(item._id)}>
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={20}
              color={isBookmarked ? "#2467f9" : isDark ? "#9CA3AF" : "#6b7280"}
            />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center ml-5">
            <Ionicons name="add-outline" size={20} color="#2467f9ff" />
            <Text className="text-blue-600 dark:text-blue-400 text-lg">Follow</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {item.content && (
        <View className="px-4 mb-3">
          <Text className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">
            {displayText}
          </Text>
          {shouldTruncate && (
            <TouchableOpacity
              onPress={() => setIsExpanded(!isExpanded)}
              className="mt-1"
            >
              <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                {isExpanded ? "See Less" : "See More"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Media */}
      {item.media && item.media.length > 0 && (
        <Image
          source={{ uri: item.media[0].url }}
          style={{ width: "100%", height: 256 }}
        />
      )}

      {/* Actions */}
      <View className="flex-row items-center justify-around mt-4">
        <TouchableOpacity
          className="flex-col items-center"
          onPress={() => {
            onLike(item._id);
          }}
          disabled={!currentUser}
        >
          <View className="flex-row items-center">
            <FontAwesome
              name={item.isLiked ? "thumbs-up" : "thumbs-o-up"}
              size={18}
              color={item.isLiked ? (isDark ? "#60A5FA" : "#000") : (isDark ? "#9CA3AF" : "#657786")}
            />
            <Text
              className={`text-sm ml-2 ${item.isLiked ? "text-black dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
            >
              {formatNumber(item.likesCount || 0)}
            </Text>
          </View>
          {item.isLiked ? (
            <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">Liked</Text>
          ) : (
            <Text className={`text-sm mt-1 text-gray-600 dark:text-gray-400`}>Like</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-col items-center"
          onPress={() => onComment(item)}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="chatbox-ellipses-outline"
              size={18}
              color={isDark ? "#9CA3AF" : "#657786"}
            />
            <Text className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              {formatNumber(item.comments?.length || 0)}
            </Text>
          </View>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-col items-center">
          <View className="flex-row items-center">
            <Feather name="repeat" size={18} color={isDark ? "#9CA3AF" : "#657786"} />
            <Text className="text-gray-500 dark:text-gray-400 text-sm ml-2">0</Text>
          </View>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">Repost</Text>
        </TouchableOpacity>

        <View className="flex-col items-center">
          <View className="flex-row items-center">
            <Ionicons
              name="eye-outline"
              size={18}
              color={isDark ? "#9CA3AF" : "#657786"}
            />
            <Text className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              {formatNumber(item.engagement?.views || 0)}
            </Text>
          </View>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">Views</Text>
        </View>

        <TouchableOpacity className="flex-col items-center">
          <Feather name="send" size={18} color={isDark ? "#9CA3AF" : "#657786"} />
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
