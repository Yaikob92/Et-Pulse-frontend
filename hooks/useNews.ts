import { newsApi, useApiClient } from "@/utils/api";
import { NewsItem } from "@/types";
import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchNews = (category?: string, search?: string) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["news", category, search],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await newsApi.getAllNews(api, pageParam, 15, category, search);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all pages into a single array
  const news: NewsItem[] = data?.pages?.flatMap((page) => page.news) ?? [];

  const likeNewsMutation = useMutation({
    mutationFn: (newsId: string) => newsApi.likeNews(api, newsId),
    onMutate: async (newsId: string) => {
      await queryClient.cancelQueries({ queryKey: ["news", category, search] });

      const previousData = queryClient.getQueryData(["news", category, search]);

      // Optimistically update across all pages
      queryClient.setQueryData(["news", category, search], (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            news: page.news.map((item: NewsItem) => {
              if (item._id === newsId) {
                const newIsLiked = !item.isLiked;
                const newLikesCount = newIsLiked
                  ? (item.likesCount || 0) + 1
                  : Math.max(0, (item.likesCount || 0) - 1);
                return { ...item, isLiked: newIsLiked, likesCount: newLikesCount };
              }
              return item;
            }),
          })),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news", category, search] });
    },
    onError: (error: any, _newsId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["news", category, search], context.previousData);
      }

      let errorMsg = "Failed to update like. Please try again.";
      if (error?.response?.status === 401) {
        errorMsg = "Please log in to like posts.";
      } else if (error?.response?.status === 404) {
        errorMsg = "Post not found.";
      } else if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error?.message === "Network Error" || !error?.response) {
        errorMsg = "Network error. Please check your connection.";
      }

      alert(errorMsg);
    },
  });

  return {
    news,
    isLoading,
    isError,
    refetch,
    toggleLike: (newsId: string) => likeNewsMutation.mutate(newsId),
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
