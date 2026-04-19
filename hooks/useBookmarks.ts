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
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["bookmarkNews"] });
      await queryClient.cancelQueries({ queryKey: ["news"] });

      const previousBookmarks = queryClient.getQueryData(["bookmarkNews"]);

      // Update Bookmark Cache
      queryClient.setQueryData(["bookmarkNews"], (old: any) => {
        const currentBookmarks = Array.isArray(old) ? old : [];
        const isCurrentlyBookmarked = currentBookmarks.some(
          (bm: any) => (bm.news?._id || bm.news) === newsId
        );

        if (isCurrentlyBookmarked) {
          return currentBookmarks.filter((bm: any) => (bm.news?._id || bm.news) !== newsId);
        } else {
          // Add a temporary shallow bookmark object
          return [...currentBookmarks, { news: newsId, createdAt: new Date().toISOString() }];
        }
      });

      return { previousBookmarks };
    },
    onSuccess: () => {
      // Only invalidate bookmarks to sync with server, leave main news alone to avoid flicker
      queryClient.invalidateQueries({ queryKey: ["bookmarkNews"] });
    },
    onError: (error, variables, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(["bookmarkNews"], context.previousBookmarks);
      }
      console.warn("Bookmark toggle failed:", error);
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
