import { bookmarkApi, useApiClient } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useBookmarks = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: bookmarks = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["bookmarkNews"],
    queryFn: () => bookmarkApi.getBookMark(api),
    select: (response) => response.data.bookMarks,
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
        if (!old?.data?.bookMarks) return old;

        const currentBookmarks = old.data.bookMarks;
        const isBookmarked = currentBookmarks.some(
          (bm: any) => (bm.news?._id || bm.news) === newsId
        );

        let updatedBookmarks;
        if (isBookmarked) {
          // Remove from bookmarks
          updatedBookmarks = currentBookmarks.filter(
            (bm: any) => (bm.news?._id || bm.news) !== newsId
          );
        } else {
          // Check if it somehow already exists in the array (extra safety)
          const alreadyInList = currentBookmarks.some(
            (bm: any) => (bm.news?._id || bm.news) === newsId
          );
          if (alreadyInList) {
            updatedBookmarks = currentBookmarks;
          } else {
            // Add a temporary bookmark object with necessary fields for UI
            updatedBookmarks = [
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
        }

        return { ...old, data: { ...old.data, bookMarks: updatedBookmarks } };
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
