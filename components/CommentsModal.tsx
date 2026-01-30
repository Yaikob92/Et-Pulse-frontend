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
    replyingTo,
    setReplyingTo,
    createComment,
    likeComment,
    isCreatingComment,
  } = useComments();

  const handleClose = () => {
    onClose();
    setCommentText("");
    setReplyingTo(null);
  };

  const totalComments = selectedNews?.comments?.length || 0;

  // Group comments and replies
  const comments = (selectedNews?.comments?.filter(c => !c.parentComment) || [])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const replies = selectedNews?.comments?.filter(c => c.parentComment) || [];

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
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <View key={comment._id} className="mb-6">
                    <View className="flex-row">
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
                          <TouchableOpacity
                            onPress={() =>
                              setReplyingTo({
                                id: comment._id,
                                username: `${comment.user.firstName} ${comment.user.lastName}`,
                              })
                            }
                          >
                            <Text className="text-sm font-bold text-gray-500">
                              Reply
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* REPLIES */}
                    {replies
                      .filter((r) => r.parentComment === comment._id)
                      .map((reply) => (
                        <View
                          key={reply._id}
                          className="flex-row mt-4 ml-10 pl-3 border-l-2 border-gray-100"
                        >
                          <Image
                            source={{ uri: reply.user.profilePicture }}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <View className="flex-1">
                            <View className="flex-row items-baseline mb-1">
                              <Text className="text-sm font-bold text-gray-900 mr-2">
                                {reply.user.firstName} {reply.user.lastName}
                              </Text>
                              <Text className="text-[10px] text-gray-400">
                                {formatDate(reply.createdAt)} ago
                              </Text>
                            </View>
                            <Text className="text-[#334155] text-sm leading-5 mb-2">
                              {reply.content}
                            </Text>
                            <TouchableOpacity
                              onPress={() => likeComment(reply._id)}
                              className="flex-row items-center"
                            >
                              <FontAwesome
                                name={
                                  reply.likes?.includes(currentUser?._id)
                                    ? "thumbs-up"
                                    : "thumbs-o-up"
                                }
                                size={12}
                                color={
                                  reply.likes?.includes(currentUser?._id)
                                    ? "#000"
                                    : "#64748b"
                                }
                              />
                              <Text
                                className={`text-xs font-semibold ml-1.5 ${reply.likes?.includes(currentUser?._id)
                                  ? "text-blue-500"
                                  : "text-gray-500"
                                  }`}
                              >
                                {reply.likes?.length || 0}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
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
            {replyingTo && (
              <View className="flex-row items-center justify-between bg-blue-50 px-4 py-3 rounded-xl mb-2 border border-blue-100">
                <Text className="text-sm text-blue-600">
                  Replying to <Text className="font-bold text-blue-700">{replyingTo.username}</Text>
                </Text>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                  <Feather name="x-circle" size={18} color="#2563eb" />
                </TouchableOpacity>
              </View>
            )}
            <View className="flex-row items-center">
              <Image
                source={{ uri: currentUser?.profilePicture }}
                className="w-11 h-11 rounded-full mr-3"
              />
              <View className="flex-1 flex-row items-center bg-[#f1f5f9] rounded-3xl px-4 py-2 border border-gray-200">
                <TextInput
                  placeholder={replyingTo ? `Reply to ${replyingTo.username}...` : "Add a comment..."}
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
