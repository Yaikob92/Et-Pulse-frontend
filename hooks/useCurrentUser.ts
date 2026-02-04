import { useQuery } from "@tanstack/react-query";
import { useApiClient, userApi } from "@/utils/api";

import { useAuth } from "@clerk/clerk-expo";

export const useCurrentUser = () => {
  const api = useApiClient();
  const { isLoaded, isSignedIn } = useAuth();

  const {
    data: currentUser,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await userApi.getCurrentUser(api);
      return response.data.user;
    },
    enabled: isLoaded && isSignedIn,
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { currentUser, isLoading: !isLoaded || isLoading, isError, refetch };
};
