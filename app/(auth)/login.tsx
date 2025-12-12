import { COLORS } from "@/constants/theme";
import { useLogin } from "@/hooks/useLogin";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Page() {
  const {
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    onSignInPress,
    handleSocialAuth,
    loadingProvider,
  } = useLogin();

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">
      <View className="items-center mb-8">
        <View className="w-15 h-15 rounded-2xl bg-[rgba(74,222,128,0.15)] justify-center items-center mb-5">
          <Ionicons name="newspaper-outline" size={32} color={COLORS.primary} />
        </View>
        <Text className="text-[42px] font-bold text-primary tracking-[0.5px] mb-2 font-jetbrains">
          Et-Pulse
        </Text>
        <Text className="text-[16px] text-grey tracking-[1px] lowercase font-jetbrains">
          don&apos;t miss anything!
        </Text>
      </View>
      <Text className="text-2xl font-bold mb-4">Sign in</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3"
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(email) => setEmailAddress(email)}
      />

      <TextInput
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(pass) => setPassword(pass)}
      />

      <TouchableOpacity
        onPress={onSignInPress}
        className="w-full bg-blue-600 rounded-lg py-3"
      >
        <Text className="text-center text-white font-semibold text-lg">
          Continue
        </Text>
      </TouchableOpacity>

      <View className="flex-row mt-4">
        <Text className="text-gray-600">Don&apos;t have an account? </Text>
        <Link href="/sign-up">
          <Text className="text-blue-600 font-semibold">Sign up</Text>
        </Link>
      </View>

      <View className="flex-row gap-2 mt-6">
        {/* Google Sign btn */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6"
          onPress={() => {
            handleSocialAuth("oauth_google");
          }}
          disabled={loadingProvider === "google"}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
            height: 48,
            width: 200,
          }}
        >
          {loadingProvider === "google" ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("../../assets/images/google.png")}
                className="size-8 mr-3"
              />
              <Text className="text-black font-medium text-base">
                Continue with Google
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Apple Sign Icon */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6"
          onPress={() => {
            handleSocialAuth("oauth_apple");
          }}
          disabled={loadingProvider === "apple"}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
            height: 48,
            minWidth: 200,
          }}
        >
          <View className="flex-row items-center justify-center">
            {loadingProvider === "apple" ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <View className="flex-row items-center justify-center">
                <Image
                  source={require("../../assets/images/apple.png")}
                  className="size-8 mr-3"
                />
                <Text className="text-black font-medium text-base">
                  Continue with Apple
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      {/* Terms and Policy */}
      <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2"></Text>
    </View>
  );
}
