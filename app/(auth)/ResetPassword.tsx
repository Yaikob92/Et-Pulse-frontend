import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useResetPassword } from "../../hooks/useResetPassword";
import { useTheme } from "@/context/ThemeContext";

export default function ResetPassword() {
    const {
        email,
        setEmail,
        code,
        setCode,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        loading,
        step,
        timeLeft,
        onRequestReset,
        onResetPassword,
    } = useResetPassword();

    const { isDark } = useTheme();

    return (
        <View className="flex-1 bg-gray-50 dark:bg-[#0F1117]">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }}
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
                        <Text className="text-2xl font-bold text-[#1a2b4b] dark:text-gray-100">
                            {step === "request" ? "Reset" : "Reset Password"}
                        </Text>

                        <Text className="text-[#1a2b4b] dark:text-gray-200 text-base font-semibold mt-2">
                            {step === "request"
                                ? "Reset to your username"
                                : "Enter your reset code and new password"}
                        </Text>

                        <Text className="text-gray-500 dark:text-gray-400 text-xs mt-2 mb-6">
                            {step === "request"
                                ? "Enter your email and a reset link will be sent to you. Let's get you back to the best news."
                                : "Please check your email for the reset code."}
                        </Text>

                        {error ? (
                            <View className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl mb-4 border border-red-100 dark:border-red-900/30">
                                <Text className="text-red-600 dark:text-red-400 text-xs text-center font-medium">
                                    {error}
                                </Text>
                            </View>
                        ) : null}

                        {step === "request" && (
                            <View className="mb-6 relative">
                                <View className="absolute left-4 top-4 z-10">
                                    <Ionicons
                                        name="mail-outline"
                                        size={20}
                                        color={isDark ? "#6B7280" : "#94a3b8"}
                                    />
                                </View>
                                <TextInput
                                    placeholder="Email"
                                    placeholderTextColor={isDark ? "#6B7280" : "#94a3b8"}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252830] rounded-2xl p-4 pl-12 text-sm text-gray-900 dark:text-gray-100"
                                />
                            </View>
                        )}

                        {step === "reset" && (
                            <>
                                <View className="mb-4">
                                    <View className="flex-row justify-between mb-2 px-1">
                                        <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium">Reset Code</Text>
                                        {timeLeft !== null && timeLeft > 0 ? (
                                            <Text
                                                className={`text-xs font-bold ${timeLeft < 60 ? "text-red-500" : "text-blue-600 dark:text-blue-400"
                                                    }`}
                                            >
                                                Expires in: {Math.floor(timeLeft / 60)}:
                                                {(timeLeft % 60).toString().padStart(2, "0")}
                                            </Text>
                                        ) : (
                                            <Text className="text-xs text-red-500 font-bold">Code expired</Text>
                                        )}
                                    </View>
                                    <TextInput
                                        placeholder="Reset Code"
                                        placeholderTextColor={isDark ? "#6B7280" : "#94a3b8"}
                                        value={code}
                                        onChangeText={setCode}
                                        className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252830] rounded-2xl p-4 text-sm text-gray-900 dark:text-gray-100"
                                    />
                                </View>

                                <View className="mb-4">
                                    <TextInput
                                        placeholder="New Password"
                                        placeholderTextColor={isDark ? "#6B7280" : "#94a3b8"}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252830] rounded-2xl p-4 text-sm text-gray-900 dark:text-gray-100"
                                    />
                                </View>

                                <View className="mb-6">
                                    <TextInput
                                        placeholder="Confirm Password"
                                        placeholderTextColor={isDark ? "#6B7280" : "#94a3b8"}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                        className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252830] rounded-2xl p-4 text-sm text-gray-900 dark:text-gray-100"
                                    />
                                </View>
                            </>
                        )}

                        <TouchableOpacity
                            onPress={step === "request" ? onRequestReset : onResetPassword}
                            disabled={loading || (step === "reset" && timeLeft === 0)}
                            className={`p-4 rounded-2xl items-center flex-row justify-center gap-2 shadow-lg ${loading || (step === "reset" && timeLeft === 0)
                                ? "bg-gray-400"
                                : "bg-blue-600"
                                }`}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white font-bold text-xs tracking-widest uppercase">
                                    {step === "request" ? "RESET NOW" : "SAVE NEW PASSWORD"}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <View className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 items-center">
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                                        Back to Login
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
