import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { useApiClient, userApi } from "@/utils/api";
import { useEffect } from "react";

export const useUserSync = () => {
  const { isSignedIn } = useAuth();
  const api = useApiClient();

  const syncUserMutation = useMutation({
    mutationFn: () => userApi.syncUser(api),
    onSuccess: (response: any) => {
      console.log("User synced successfully:", response.data.message);
    },
    onError: (error: any) => {
      console.error("User sync failed:");
      if (error) {
        console.error("Error response data:", error.response?.data || error.message);
      }
    },
  });

  // auto-sync user when signed in
  useEffect(() => {
    // if user is signed in and user is not synced yet, sync user
    if (isSignedIn && !syncUserMutation.isSuccess && !syncUserMutation.isPending) {
      syncUserMutation.mutate();
    }
  }, [isSignedIn, syncUserMutation.isSuccess, syncUserMutation.isPending]);

  return null;
};
