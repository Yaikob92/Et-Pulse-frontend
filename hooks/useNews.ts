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
    queryFn: () => newsApi.getAllNews(api),
    select: (response) => response.data.news,
  });
  const likeNewsMutation = useMutation({
    mutationFn: (newsId: string) => newsApi.likeNews(api, newsId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["news"] }),
  });

  const checkIsLiked = (likes: string[], currentUser: any): boolean => {
    return !!(currentUser && likes.includes(currentUser._id));
  };

  return {
    news,
    isLoading,
    isError,
    refetch,
    checkIsLiked,
    toggleLike: (newsId: string) => likeNewsMutation.mutate(newsId),
  };
};
