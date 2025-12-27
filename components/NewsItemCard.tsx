import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { formatDate, formatNumber } from "@/utils/formatter";
import { NewsItem } from "@/types";

type Props = {
  item: NewsItem;
};

export const NewsItemCard = ({ item }: Props) => {
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
              {formatDate(item.publishedAt)}
            </Text>
          </View>
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="add-outline" size={25} color="#2467f9ff" />
            <Text className="text-blue-600 text-lg">Follow</Text>
          </TouchableOpacity>
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

      {/* Actions */}
      <View className="flex-row items-center justify-around mt-4">
        <TouchableOpacity className="flex-col items-center">
          <View className="flex-row items-center">
            <Feather name="thumbs-up" size={18} color="#657786" />
            <Text className="text-gray-500 ml-2">
              {formatNumber(item.likesCount || 0)}
            </Text>
          </View>
          <Text className="text-sm text-gray-600 mt-1">Like</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-col items-center" onPress={() => {}}>
          <View className="flex-row items-center">
            <Ionicons
              name="chatbox-ellipses-outline"
              size={18}
              color="#657786"
            />
            <Text className="text-gray-500 text-sm ml-2">
              {formatNumber(item.comments?.length || 0)}
            </Text>
          </View>
          <Text className="text-sm text-gray-600 mt-1">Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-col items-center">
          <View className="flex-row items-center">
            <Feather name="repeat" size={18} color="#657786" />
            <Text className="text-gray-500 text-sm ml-2">0</Text>
          </View>
          <Text className="text-sm text-gray-600 mt-1">Repost</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-col items-center">
          <Feather name="send" size={18} color="#657786" />
          <Text className="text-sm text-gray-600 mt-1">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
