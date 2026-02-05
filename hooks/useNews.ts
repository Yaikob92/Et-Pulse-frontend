import { newsApi, useApiClient } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchNews = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: news,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const response = await newsApi.getAllNews(api);
      return response.data.news ?? [];
    },
  });

  const likeNewsMutation = useMutation({
    mutationFn: (newsId: string) => newsApi.likeNews(api, newsId),
    onMutate: async (newsId: string) => {
      // Cancel any outgoing refetches to avoid optimistic update being overwritten
      await queryClient.cancelQueries({ queryKey: ["news"] });

      // Snapshot the previous value
      const previousNews = queryClient.getQueryData(["news"]);

      // Optimistically update the cache
      queryClient.setQueryData(["news"], (old: any) => {
        const currentNews = Array.isArray(old) ? old : [];
        return currentNews.map((item: any) => {
          if (item._id === newsId) {
            const newIsLiked = !item.isLiked;
            const newLikesCount = newIsLiked
              ? (item.likesCount || 0) + 1
              : Math.max(0, (item.likesCount || 0) - 1);

            return { ...item, isLiked: newIsLiked, likesCount: newLikesCount };
          }
          return item;
        });
      });

      return { previousNews };
    },
    onSuccess: () => {
      // Refetch to ensure we have the latest data from server
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error: any, newsId, context) => {
      // Rollback to previous state on error
      if (context?.previousNews) {
        queryClient.setQueryData(["news"], context.previousNews);
      }

      // Log detailed error information for debugging
      try {
        console.log("Like failed:", {
          newsId,
          errorMessage: error?.message,
          errorStatus: error?.response?.status,
          errorData: error?.response?.data,
          fullError: error,
        });
      } catch (logError) {
        console.log("Error logging failed:", logError);
      }

      // Determine user-friendly error message
      let errorMsg = "Failed to update like. Please try again.";

      try {
        if (error?.response?.status === 401) {
          errorMsg = "Please log in to like posts.";
        } else if (error?.response?.status === 404) {
          errorMsg = "Post not found.";
        } else if (error?.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error?.message === "Network Error" || !error?.response) {
          errorMsg = "Network error. Please check your connection.";
        } else if (error?.message) {
          errorMsg = `Error: ${error.message}`;
        }
      } catch (msgError) {
        console.log("Error message parsing failed:", msgError);
      }

      console.log("Showing error alert:", errorMsg);
      alert(errorMsg);
    },
  });

  return {
    news,
    isLoading,
    isError,
    refetch,
    toggleLike: (newsId: string) => likeNewsMutation.mutate(newsId),
  };
};
