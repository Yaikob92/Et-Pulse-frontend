import InitialLayout from "@/components/InitialLayout";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaProvider>
        {/* Status Bar */}
        <ExpoStatusBar style="dark" />

        {/* Full-screen container */}
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
