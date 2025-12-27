import { useQuery } from "@tanstack/react-query";
import { useApiClient, newsApi } from "@/utils/api";

export const useFetchNews = () => {
  const api = useApiClient();

  const {
    data: news,
    isLoading,
    isError,
    data,
    error,
    refetch,
  } = useQuery({
    queryKey: ["news"],
    queryFn: () => newsApi.getAllNews(api),
    select: (response) => response.data.news,
  });
  return { news, isLoading, isError, data, error, refetch };
};
