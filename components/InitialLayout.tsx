import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    // Check if the user is in an authentication group
    const inAuthGroup = segments[0] === "(auth)";

    if (!isSignedIn && !inAuthGroup) {
      // Bring them back to the login screen
      router.replace("/(auth)/login");
    } else if (isSignedIn && inAuthGroup) {
      // Go to tabs root
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, segments, router]);

  if (!isLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
