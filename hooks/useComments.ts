import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";
import { useApiClient, commentApi } from "../utils/api";
import { useCurrentUser } from "./useCurrentUser";

export const useComments = () => {
  const { currentUser } = useCurrentUser();
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    username: string;
  } | null>(null);
  const api = useApiClient();

  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: async ({
      newsId,
      content,
      parentCommentId,
    }: {
      newsId: string;
      content: string;
      parentCommentId?: string;
    }) => {
      if (parentCommentId) {
        const response = await commentApi.addReply(api, parentCommentId, content);
        return response.data;
      }
      const response = await commentApi.createComment(api, newsId, content);
      return response.data;
    },
    onSuccess: () => {
      setCommentText("");
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error: any, variables) => {
      const type = variables.parentCommentId ? "reply" : "comment";
      Alert.alert("Error", `Failed to post ${type}, try again`);
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await commentApi.likeComment(api, commentId);
      return response.data;
    },
    onMutate: async (commentId) => {
      const currentUserId = currentUser?._id;
      if (!currentUserId) return;

      // Cancel outgoing refetches
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["news"] }),
        queryClient.cancelQueries({ queryKey: ["bookmarkNews"] }),
      ]);

      // Snapshot previous values
      const previousNews = queryClient.getQueryData(["news"]);
      const previousBookmarks = queryClient.getQueryData(["bookmarkNews"]);

      const updateCommentInNews = (newsItems: any[]) => {
        return newsItems.map((item: any) => {
          if (!item.comments?.some((c: any) => c._id === commentId)) {
            return item;
          }

          return {
            ...item,
            comments: item.comments.map((c: any) => {
              if (c._id === commentId) {
                const isLiked = (c.likes || []).some(
                  (id: any) => id.toString() === currentUserId.toString()
                );

                const newLikes = isLiked
                  ? (c.likes || []).filter(
                    (id: any) => id.toString() !== currentUserId.toString()
                  )
                  : [...(c.likes || []), currentUserId];

                return { ...c, likes: newLikes };
              }
              return c;
            }),
          };
        });
      };

      // Optimistically update news cache
      if (previousNews) {
        queryClient.setQueryData(["news"], (old: any) => {
          if (!Array.isArray(old)) return old;
          return updateCommentInNews(old);
        });
      }

      // Optimistically update bookmarks cache
      if (previousBookmarks) {
        queryClient.setQueryData(["bookmarkNews"], (old: any) => {
          if (!Array.isArray(old)) return old;
          return old.map((bm: any) => {
            if (!bm.news) return bm;
            const updated = updateCommentInNews([bm.news])[0];
            return { ...bm, news: updated };
          });
        });
      }

      return { previousNews, previousBookmarks };
    },
    onError: (err: any, commentId, context) => {
      console.error("Like comment error:", err?.response?.data || err.message);
      if (context?.previousNews) {
        queryClient.setQueryData(["news"], context.previousNews);
      }
      if (context?.previousBookmarks) {
        queryClient.setQueryData(["bookmarkNews"], context.previousBookmarks);
      }
      Alert.alert("Error", "Failed to like comment");
    },
    onSettled: () => {
      // Background refetch to stay in sync
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarkNews"] });
    },
  });

  const createComment = (newsId: string) => {
    if (!commentText.trim()) {
      Alert.alert("Empty", "Please write something before you post");
      return;
    }
    createCommentMutation.mutate({
      newsId,
      content: commentText.trim(),
      parentCommentId: replyingTo?.id,
    });
  };

  const likeComment = (commentId: string) => {
    if (!currentUser) {
      Alert.alert("Login Required", "Please log in to like comments");
      return;
    }
    likeCommentMutation.mutate(commentId);
  };

  return {
    commentText,
    setCommentText,
    replyingTo,
    setReplyingTo,
    createComment,
    likeComment,
    isCreatingComment: createCommentMutation.isPending,
  };
};
