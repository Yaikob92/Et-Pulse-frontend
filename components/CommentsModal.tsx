import { useComments } from "@/hooks/useComments";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { NewsItem, CommentType } from "@/types";
import { useUser } from "@clerk/clerk-expo";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface CommentsProps {
  selectedNews: NewsItem;
  onClose: () => void;
}

type CommentItemProps = {
  comment: CommentType;
};

const CommentsItem = ({ comment }: CommentItemProps) => {
  return (
    <View className="border-b border-gray-100 bg-white p-4">
      <View className="flex-row">
        <Image
          source={{ uri: comment.userId.profilePicture }}
          className="w-10 h-10 rounded-full mr-3"
        />

        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="font-bold text-gray-900 mr-1">
              {comment.userId.firstName} {comment.userId.lastName}
            </Text>
            <Text className="text-gray-500 text-sm ml-1">
              @{comment.userId.username}
            </Text>
          </View>

          <Text className="text-gray-900 text-base leading-5">
            {comment.content}
          </Text>
        </View>
      </View>
    </View>
  );
};

const CommentsModal = ({ selectedNews, onClose }: CommentsProps) => {
  const { user } = useUser();
  const { commentText, setCommentText, createComment, isCreatingComment } =
    useComments();
  const { currentUser } = useCurrentUser();

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

      {/* Comments List */}

      <FlatList
        data={selectedNews?.comments ?? []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <CommentsItem comment={item} />}
      />

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
          onPress={() => selectedNews && createComment(selectedNews._id)}
          disabled={isCreatingComment || !commentText.trim() || !selectedNews}
        >
          {isCreatingComment ? (
            <ActivityIndicator size="small" color="color" />
          ) : (
            <Feather name="send" size={20} color="blue" />
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CommentsModal;
