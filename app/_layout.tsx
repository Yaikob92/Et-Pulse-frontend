import InitialLayout from "@/components/InitialLayout";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { View } from "react-native";

const queryclient = new QueryClient();

/**
 * Inner shell that reads the theme context and applies the
 * NativeWind colorScheme so all `dark:` classes take effect.
 */
function ThemedApp() {
  const { isDark } = useTheme();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <View className="flex-1 bg-white dark:bg-[#0F1117]">
      <ExpoStatusBar style={isDark ? "light" : "dark"} />
      <SafeAreaView
        style={{ flex: 1 }}
        edges={["top", "bottom"]}
      >
        <InitialLayout />
      </SafeAreaView>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryclient}>
        <SafeAreaProvider>
          <ThemeProvider>
            <ThemedApp />
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
