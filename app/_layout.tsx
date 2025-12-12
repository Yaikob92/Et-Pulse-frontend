import { ClerkProvider } from "@clerk/clerk-expo";

import InitialLayout from "@/components/InitialLayout";
import { SplashScreen } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ClerkProvider>
      <SafeAreaProvider>
        {/* Status Bar */}
        <ExpoStatusBar style="light" backgroundColor="#000" />

        {/* Full-screen container */}
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
