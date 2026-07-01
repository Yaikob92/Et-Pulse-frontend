import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { NewsItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";

type BookMarkProps = {
  item: NewsItem;
  onRemove?: (newsId: string) => void;
  onPress?: (newsId: string) => void;
};

export const BookMarkCards = ({ item, onRemove, onPress }: BookMarkProps) => {
  const date = item.createdAt ? new Date(item.createdAt) : new Date();
  const isValidDate = !isNaN(date.getTime());

  const timeAgo = isValidDate
    ? formatDistanceToNow(date, {
      addSuffix: false,
    })
      .toUpperCase()
      .replace("ABOUT ", "")
    : "JUST NOW";

  const channel = typeof item.channel_id === "object" ? item.channel_id : null;
  const channelUsername = channel?.username || "";
  const channelProfilePic = channel?.profile_pic || "https://ui-avatars.com/api/?name=Channel&background=0D8ABC&color=fff";
  const mediaUrl = item.media?.[0]?.url || channelProfilePic;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress?.(item._id)}
      className="bg-white dark:bg-[#1A1D27] rounded-3xl p-4 mb-4 flex-row items-center shadow-sm"
    >
      {/* Image Section */}
      <View className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Image
          source={{ uri: mediaUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Content Section */}
      <View className="flex-1 ml-4 justify-between h-24">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-2">
            <Text
              className="text-[#1A1A1A] dark:text-gray-100 text-[15px] font-bold leading-5"
              numberOfLines={2}
            >
              {item.content || "No title available"}
            </Text>
            <Text className="text-[#8E8E93] dark:text-gray-500 text-[13px] mt-1" numberOfLines={1}>
              {item.content?.substring(0, 50)}...
            </Text>
          </View>
          <TouchableOpacity onPress={() => onRemove?.(item._id)}>
            <Ionicons name="bookmark" size={20} color="#2467f9ff" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          <Text className="text-[#00B4FF] text-[11px] font-bold">
            ET-PULSE {(channelUsername || "").toUpperCase()}
          </Text>
          <View className="w-1 h-1 rounded-full bg-[#8E8E93] mx-2" />
          <Text className="text-[#8E8E93] dark:text-gray-500 text-[11px] font-medium">
            {timeAgo} AGO
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
