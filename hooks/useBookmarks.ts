import { bookmarkApi, useApiClient } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useCurrentUser } from "./useCurrentUser";

export const useBookmarks = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const { currentUser } = useCurrentUser();

  const {
    data: bookmarks = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["bookmarkNews"],
    queryFn: async () => {
      const response = await bookmarkApi.getBookMark(api);
      return response.data.bookMarks ?? [];
    },
    enabled: !!currentUser,
  });

  const createBookMarkMutation = useMutation({
    mutationFn: async ({ newsId }: { newsId: string }) => {
      const response = await bookmarkApi.saveNews(api, newsId);
      return response.data;
    },
    onMutate: async ({ newsId }) => {
      await queryClient.cancelQueries({ queryKey: ["bookmarkNews"] });
      const previousBookmarks = queryClient.getQueryData(["bookmarkNews"]);

      queryClient.setQueryData(["bookmarkNews"], (old: any) => {
        const currentBookmarks = Array.isArray(old) ? old : [];
        const isBookmarked = currentBookmarks.some(
          (bm: any) => (bm.news?._id || bm.news) === newsId
        );

        if (isBookmarked) {
          // Remove from bookmarks
          return currentBookmarks.filter(
            (bm: any) => (bm.news?._id || bm.news) !== newsId
          );
        } else {
          // Add a temporary bookmark object
          return [
            ...currentBookmarks,
            {
              news: {
                _id: newsId,
                createdAt: new Date().toISOString(),
                channelUsername: "Loading...",
                content: "Saving bookmark...",
                likesCount: 0,
                isLiked: false,
              },
            },
          ];
        }
      });

      return { previousBookmarks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarkNews"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error, variables, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(["bookmarkNews"], context.previousBookmarks);
      }
      Alert.alert("error", "Failed to bookMark news");
    },
  });

  const checkIsBookmarked = (newsId: string): boolean => {
    return bookmarks.some((bm: any) => (bm.news?._id || bm.news) === newsId);
  };

  return {
    news: bookmarks.map((bm: any) => bm.news).filter(Boolean),
    isLoading,
    isError,
    refetch,
    checkIsBookmarked,
    saveBookMark: (newsId: string) => createBookMarkMutation.mutate({ newsId }),
  };
};
