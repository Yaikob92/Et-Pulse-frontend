import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { formatDate, formatNumber } from "@/utils/formatter";
import { NewsItem, User } from "@/types";

type NewsCardProps = {
  item: NewsItem;
  onLike: (newsId: string) => void;
  isLiked?: boolean;
  onComment: (news: NewsItem) => void;
  currentUser: User;
  onBookmark: (newsId: string) => void;
  isBookmarked: boolean;
};

export const NewsItemCard = ({
  item,
  onLike,
  isLiked,
  onComment,
  currentUser,
  onBookmark,
  isBookmarked,
}: NewsCardProps) => {
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
          <TouchableOpacity onPress={() => onBookmark(item._id)}>
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={20}
              color={isBookmarked ? "#2467f9" : "#6b7280"}
            />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center ml-5">
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
              color={item.isLiked ? "#000" : "#657786"}
            />
            <Text
              className={`text-sm ml-2 ${item.isLiked ? "text-black-900" : "text-gray-600"}`}
            >
              {formatNumber(item.likesCount || 0)}
            </Text>
          </View>
          {item.isLiked ? (
            <Text className="text-sm text-gray-600 mt-1">Liked</Text>
          ) : (
            <Text className={`text-sm mt-1 text-gray-600`}>Like</Text>
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
