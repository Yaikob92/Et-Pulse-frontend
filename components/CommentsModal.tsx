import { useComments } from "@/hooks/useComments";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { NewsItem } from "@/types";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface CommentsProps {
  selectedNews: NewsItem;
  onClose: () => void;
}

const CommentsModal = ({ selectedNews, onClose }: CommentsProps) => {
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

      {/* Input Bar */}
      <View className="absolute bottom-1 left-0 right-0 flex-row items-center px-4 py-3 border-t border-gray-200">
        <Image
          source={{ uri: currentUser?.profilePicture }}
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
