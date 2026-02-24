import { useLogin } from "@/hooks/useLogin";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

export default function Page() {
  const {
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    onSignInPress,
    handleSocialAuth,
    loadingProvider,
    error,
    loading,
  } = useLogin();

  const [rememberMe, setRememberMe] = React.useState(false);
  const { isDark } = useTheme();

  return (
    <View className="flex-1 bg-gray-50 dark:bg-[#0F1117]">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[400px] self-center relative">
          {/* Logo */}
          <View
            className="absolute -top-10 left-1/2 -ml-8 z-10"
            style={{ transform: [{ translateX: 0 }] }}
          >
            <View className="bg-white dark:bg-[#1A1D27] p-2 rounded-full shadow-lg">
              <Image
                // source={require("../../assets/images/logo-abbr.png")}
                className="w-16 h-16 rounded-full"
              />
            </View>
          </View>

          <View className="bg-white dark:bg-[#1A1D27] rounded-3xl p-8 pt-12 shadow-sm border border-gray-100 dark:border-gray-800">
            <Text className="text-3xl font-bold text-[#1a2b4b] dark:text-gray-100">
              Login
            </Text>

            <Text className="text-base font-semibold mt-2 text-[#1a2b4b] dark:text-gray-200">
              Login to your account
            </Text>

            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-6">
              Thank you for coming back to Et-Pulse news application, let's
              access the best news for you.
            </Text>

            <View className="mb-4">
              <TextInput
                placeholder="admin@etpulse.com"
                placeholderTextColor={isDark ? "#6B7280" : "#94a3b8"}
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252830] rounded-xl p-4 text-sm text-gray-900 dark:text-gray-100"
              />
            </View>

            <View className="mb-4">
              <TextInput
                placeholder="••••••"
                placeholderTextColor={isDark ? "#6B7280" : "#94a3b8"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                textContentType="password"
                className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252830] rounded-xl p-4 text-sm text-gray-900 dark:text-gray-100"
              />
            </View>

            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity
                className="flex-row items-center gap-2"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  className={`w-5 h-5 rounded-md border items-center justify-center ${rememberMe
                    ? "bg-blue-600 border-blue-600"
                    : "bg-gray-50 dark:bg-[#252830] border-gray-200 dark:border-gray-700"
                    }`}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
                <Text className="text-[#1a2b4b] dark:text-gray-300 font-medium text-sm">
                  Remember Me
                </Text>
              </TouchableOpacity>

              <Link href="/(auth)/ResetPassword" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    Forget password?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            {error ? (
              <View className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl mb-4 border border-red-100 dark:border-red-900/30">
                <Text className="text-red-600 dark:text-red-400 text-xs text-center font-medium">
                  {error}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={onSignInPress}
              disabled={
                loading ||
                loadingProvider === "google" ||
                loadingProvider === "apple"
              }
              className={`p-4 rounded-xl items-center shadow-lg ${loading ||
                loadingProvider === "google" ||
                loadingProvider === "apple"
                ? "bg-gray-400"
                : "bg-blue-600"
                }`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-sm uppercase tracking-widest">
                  LOGIN
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              <Text className="mx-4 text-gray-400 dark:text-gray-500 text-xs">
                OR
              </Text>
              <View className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </View>

            <View className="flex-row gap-3 justify-center">
              <TouchableOpacity
                onPress={() => handleSocialAuth("oauth_google")}
                className="py-1 px-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252830]"
              >
                <Image
                  source={require("../../assets/images/google.png")}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSocialAuth("oauth_apple")}
                className="py-2 px-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252830]"
              >
                <Image
                  source={require("../../assets/images/apple.png")}
                  className="w-7 h-7"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Don't have an account?{" "}
              </Text>
              <Link href="/(auth)/Register" asChild>
                <TouchableOpacity>
                  <Text className="text-[#1a2b4b] dark:text-blue-400 font-bold text-sm">
                    Create an Account
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
