import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";
import { useApiClient, commentApi } from "../utils/api";

export const useComments = () => {
  const [commentText, setCommentText] = useState("");
  const api = useApiClient();

  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: async ({
      newsId,
      content,
    }: {
      newsId: string;
      content: string;
    }) => {
      const response = await commentApi.createComment(api, newsId, content);
      return response.data;
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to post comment, try again");
    },
  });

  const createComment = (newsId: string) => {
    if (!commentText.trim()) {
      {
        Alert.alert("Empty", "Please write something before you post");
        return;
      }
    }
    createCommentMutation.mutate({ newsId, content: commentText.trim() });
  };
  return {
    commentText,
    setCommentText,
    createComment,
    isCreatingComment: createCommentMutation.isPending,
  };
};
