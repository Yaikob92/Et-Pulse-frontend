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
import { Feather } from "@expo/vector-icons";

interface CommentsProps {
  selectedNews: NewsItem | null;
  onClose: () => void;
}

const CommentsModal = ({ selectedNews, onClose }: CommentsProps) => {
  const { user } = useUser();
  const { commentText, setCommentText, createComment, isCreatingComment } =
    useComments();

  const handleClose = () => {
    onClose();
    setCommentText("");
  };

  return (
    <Modal
      visible={!!selectedNews}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      {/* MODAL HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={handleClose}>
          <Text className="text-blue-500 text-lg">Close</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Comments</Text>
        <View className="w-12" />
      </View>

      {selectedNews && (
        <ScrollView>
          {selectedNews.comments?.map((comment) => (
            <View
              key={comment._id}
              className="border-b border-gray-100 bg-white p-4"
            >
              <View className="flex-row">
                <Image
                  source={{ uri: comment.user.profilePicture }}
                  className="w-10 h-10 rounded-full mr-3"
                />

                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="font-bold text-gray-900 mr-1">
                      {comment.user.firstName} {comment.user.lastName}
                    </Text>
                    <Text className="text-gray-500 text-sm ml-1">
                      @{comment.user.username}
                    </Text>
                  </View>

                  <Text className="text-gray-900 text-base leading-5 mb-2">
                    {comment.content}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Input Bar */}
      <View className="absolute bottom-1 left-0 right-0 flex-row items-center px-4 py-3 border-t border-gray-200">
        <Image
          source={{ uri: user?.imageUrl }}
          className="w-10 h-10 rounded-full mr-2"
        />
        <TextInput
          placeholder="Add a comment...."
          className="flex-1 bg-gray-100 rounded-full px-4 py-4"
          value={commentText}
          onChangeText={setCommentText}
          multiline
          numberOfLines={3}
          textAlignVertical="center"
        />
        <TouchableOpacity
          className="ml-3"
          onPress={() => {
            if (!selectedNews) return;
            createComment(selectedNews._id);
          }}
          disabled={isCreatingComment || !commentText.trim()}
        >
          {isCreatingComment ? (
            <ActivityIndicator size={"small"} color={"color"} />
          ) : (
            <Feather name="send" size={20} color="blue" />
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CommentsModal;
