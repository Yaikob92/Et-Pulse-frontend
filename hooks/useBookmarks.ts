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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarkNews"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: () => {
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
