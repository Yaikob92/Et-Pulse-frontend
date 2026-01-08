import { View, Text, Image } from "react-native";
import React from "react";
import { NewsItem } from "@/types";
import { formatDate } from "@/utils/formatter";

type BookMarkProps = {
  item: NewsItem;
};

export const BookMarkCards = ({ item }: BookMarkProps) => {
  return (
    <View className="bg-white border-b border-gray-400 pb-4 mb-3">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 mb-3">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: item.channelProfilePic }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: "#F3F4F6",
            }}
          />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-gray-900">
              {item.channelUsername.toUpperCase() ?? ""}
            </Text>
            <Text className="text-[13px] text-gray-500">
              {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      {item.content && (
        <View className="px-4 mb-3">
          <Text className="text-blue-600 mt-1">{item.content}</Text>
        </View>
      )}

      {/* Media */}
      {item.mediaUrl && (
        <Image
          source={{ uri: item.mediaUrl }}
          style={{ width: "100%", height: 256 }}
        />
      )}
    </View>
  );
};
