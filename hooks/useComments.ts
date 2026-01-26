import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";
import { useApiClient, commentApi } from "../utils/api";
import { useCurrentUser } from "./useCurrentUser";

export const useComments = () => {
  const { currentUser } = useCurrentUser();
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

  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await commentApi.likeComment(api, commentId);
      return response.data;
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ["news"] });
      const previousNews = queryClient.getQueryData(["news"]);

      queryClient.setQueryData(["news"], (old: any) => {
        if (!old?.data?.news) return old;
        return {
          ...old,
          data: {
            ...old.data,
            news: old.data.news.map((n: any) => ({
              ...n,
              comments: n.comments?.map((c: any) => {
                if (c._id === commentId) {
                  const currentUserId = currentUser?._id;
                  const isLiked = c.likes?.some(
                    (id: any) => id.toString() === currentUserId?.toString()
                  );
                  return {
                    ...c,
                    likes: isLiked
                      ? c.likes.filter(
                        (id: any) =>
                          id.toString() !== currentUserId?.toString()
                      )
                      : [...(c.likes || []), currentUserId],
                  };
                }
                return c;
              }),
            })),
          },
        };
      });

      return { previousNews };
    },
    onError: (err: any, commentId, context) => {
      console.error("Like comment error:", err?.response?.data || err.message);
      if (context?.previousNews) {
        queryClient.setQueryData(["news"], context.previousNews);
      }
      Alert.alert("Error", "Failed to like comment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
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

  const likeComment = (commentId: string) => {
    likeCommentMutation.mutate(commentId);
  };

  return {
    commentText,
    setCommentText,
    createComment,
    likeComment,
    isCreatingComment: createCommentMutation.isPending,
  };
};
