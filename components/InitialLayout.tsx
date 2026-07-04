import { useAuth } from "@clerk/clerk-expo";
import { Stack, useSegments, Redirect } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { useTheme } from "@/context/ThemeContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function InitialLayout() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isThemeLoaded } = useTheme();
  const segments = useSegments();

  const isLoaded = isAuthLoaded && isThemeLoaded;

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) return null;

  const inAuthGroup = segments[0] === "(auth)";

  if (!isSignedIn && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  } else if (isSignedIn && inAuthGroup) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

