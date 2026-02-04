import { useApiClient, userApi } from "@/utils/api";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useUserSync = () => {
  const { isSignedIn } = useAuth();
  const api = useApiClient();

  const queryClient = useQueryClient();

  const syncUserMutation = useMutation({
    mutationFn: async () => {
      try {
        return await userApi.syncUser(api);
      } catch (error: any) {
        if (error.response?.data?.error?.includes("E11000")) {
          return { data: { message: "User already synced" } };
        }
        throw error;
      }
    },
    onSuccess: (response: any) => {
      console.log("User synced successfully:", response.data.message);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
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
