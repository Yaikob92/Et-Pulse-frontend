import { useComments } from "@/hooks/useComments";
import { NewsItem } from "@/types";
import { useUser } from "@clerk/clerk-expo";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { formatDate, formatNumber } from "@/utils/formatter";

interface CommentsProps {
  selectedNews: NewsItem | null;
  onClose: () => void;
}

const CommentsModal = ({ selectedNews, onClose }: CommentsProps) => {
  const { currentUser } = useCurrentUser();
  const {
    commentText,
    setCommentText,
    createComment,
    likeComment,
    isCreatingComment,
  } = useComments();

  const handleClose = () => {
    onClose();
    setCommentText("");
  };

  const totalComments = selectedNews?.comments?.length || 0;

  return (
    <Modal
      visible={!!selectedNews}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View className="bg-white rounded-t-[32px] h-[75%] shadow-lg">
          {/* PULL HANDLE */}
          <View className="items-center pt-3 pb-1">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </View>

          {/* HEADER */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
            <View className="w-10" />
            <View className="items-center">
              <Text className="text-xl font-bold text-gray-900">Comments</Text>
              <Text className="text-[10px] font-bold text-gray-400 mt-0.5">
                {formatNumber(totalComments)} TOTAL
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              className="bg-gray-100 p-2 rounded-full"
            >
              <Feather name="x" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {selectedNews && (
            <ScrollView
              className="flex-1 p-4"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {selectedNews.comments && selectedNews.comments.length > 0 ? (
                selectedNews.comments.map((comment) => (
                  <View key={comment._id} className="flex-row mb-6">
                    <Image
                      source={{ uri: comment.user.profilePicture }}
                      className="w-12 h-12 rounded-full mr-3"
                    />

                    <View className="flex-1">
                      <View className="flex-row items-baseline mb-1">
                        <Text className="text-base font-bold text-gray-900 mr-2">
                          {comment.user.firstName} {comment.user.lastName}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          {formatDate(comment.createdAt)} ago
                        </Text>
                      </View>

                      <Text className="text-[#334155] text-base leading-5 mb-3">
                        {comment.content}
                      </Text>

                      <View className="flex-row items-center">
                        <TouchableOpacity
                          onPress={() => likeComment(comment._id)}
                          className="flex-row items-center mr-6"
                        >
                          <FontAwesome
                            name={
                              comment.likes?.includes(currentUser?._id)
                                ? "thumbs-up"
                                : "thumbs-o-up"
                            }
                            size={15}
                            color={
                              comment.likes?.includes(currentUser?._id)
                                ? "#000"
                                : "#64748b"
                            }
                          />
                          <Text
                            className={`text-sm font-semibold ml-2 ${comment.likes?.includes(currentUser?._id)
                              ? "text-blue-500"
                              : "text-gray-500"
                              }`}
                          >
                            {comment.likes?.length || 0}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <Text className="text-sm font-bold text-gray-500">
                            Reply
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View className="flex-1 items-center justify-center py-20">
                  <Ionicons name="chatbubble-ellipses-outline" size={64} color="#e2e8f0" />
                  <Text className="text-xl font-bold text-gray-900 mt-4">
                    Be the first to comment
                  </Text>
                  <Text className="text-gray-400 text-center mt-2 px-10">
                    Share your thoughts with the community
                  </Text>
                </View>
              )}
            </ScrollView>
          )}

          {/* FOOTER INPUT */}
          <View className="px-4 pt-3 pb-10 border-t border-gray-100 bg-white">
            <View className="flex-row items-center">
              <Image
                source={{ uri: currentUser?.profilePicture }}
                className="w-11 h-11 rounded-full mr-3"
              />
              <View className="flex-1 flex-row items-center bg-[#f1f5f9] rounded-3xl px-4 py-2 border border-gray-200">
                <TextInput
                  placeholder="Add a comment..."
                  placeholderTextColor="#94a3b8"
                  className="flex-1 text-gray-900 py-1"
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline={true}
                  numberOfLines={2}
                />

                <TouchableOpacity
                  onPress={() => {
                    if (!selectedNews) return;
                    createComment(selectedNews._id);
                  }}
                  disabled={isCreatingComment || !commentText.trim()}
                >
                  {isCreatingComment ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                  ) : (
                    <Ionicons
                      name="paper-plane"
                      size={22}
                      color={commentText.trim() ? "#1D9BF0" : "#cbd5e1"}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommentsModal;
