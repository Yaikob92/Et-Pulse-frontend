import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignup } from "../../hooks/useSignup";

export default function Register() {
  const {
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    fullName,
    setFullName,
    pendingVerification,
    code,
    setCode,
    loading,
    error,
    setError,
    onSignUpPress,
    onVerifyPress,
  } = useSignup();

  const [confirmPassword, setConfirmPassword] = React.useState("");
  const { isDark } = useTheme();

  // UI state
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [receiveEmails, setReceiveEmails] = React.useState(false);

  // Validation helper functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (
    pwd: string,
  ): { valid: boolean; message?: string } => {
    if (pwd.length < 8) {
      return {
        valid: false,
        message: "Password must be at least 8 characters long",
      };
    }
    if (!/[A-Z]/.test(pwd)) {
      return {
        valid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }
    if (!/[a-z]/.test(pwd)) {
      return {
        valid: false,
        message: "Password must contain at least one lowercase letter",
      };
    }
    if (!/[0-9]/.test(pwd)) {
      return {
        valid: false,
        message: "Password must contain at least one number",
      };
    }
    return { valid: true };
  };

  const handleSignUp = async () => {
    setError(null);
    if (!fullName.trim()) {
      Alert.alert("Validation Error", "Please enter your full name");
      return;
    }
    if (!emailAddress.trim() || !validateEmail(emailAddress)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }
    if (!password) {
      Alert.alert("Validation Error", "Please enter a password");
      return;
    }
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      Alert.alert(
        "Validation Error",
        passwordValidation.message || "Invalid password",
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }
    if (!agreeTerms) {
      Alert.alert(
        "Terms Required",
        "Please agree to the Terms & Conditions to continue",
      );
      return;
    }
    await onSignUpPress();
  };

  const handleVerify = async () => {
    setError(null);
    if (!code.trim()) {
      Alert.alert("Validation Error", "Please enter the verification code");
      return;
    }
    await onVerifyPress();
  };

  const generatePassword = () => {
    const randomPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8).toUpperCase();
    setPassword(randomPassword);
    setConfirmPassword(randomPassword);
  };

  const Checkbox = ({
    checked,
    onPress,
    label,
    boldLabel,
  }: {
    checked: boolean;
    onPress: () => void;
    label: string;
    boldLabel?: string;
  }) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center mb-3">
      <View
        className={`w-5 h-5 rounded-md border items-center justify-center mr-3 ${
          checked
            ? "bg-blue-600 border-blue-600"
            : "bg-gray-50 dark:bg-[#252830] border-gray-200 dark:border-gray-700"
        }`}
      >
        {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
      </View>
      <Text className="text-gray-500 dark:text-gray-400 text-xs flex-1">
        {label}{" "}
        {boldLabel && (
          <Text className="text-[#1a2b4b] dark:text-gray-100 font-bold">
            {boldLabel}
          </Text>
        )}
      </Text>
    </TouchableOpacity>
  );

  React.useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        { text: "OK", onPress: () => setError(null) },
      ]);
    }
  }, [error]);

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-[#0F1117] justify-center p-4">
        <View className="bg-white dark:bg-[#1A1D27] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <Text className="text-2xl font-bold text-[#1a2b4b] dark:text-gray-100 mb-4">
            Verify Email
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 mb-6 font-medium">
            We&apos;ve sent a verification code to {emailAddress}
          </Text>
          <TextInput
            value={code}
            placeholder="000000"
            placeholderTextColor={isDark ? "#6B7280" : "#94a3b8"}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252830] rounded-xl p-4 mb-6 text-xl text-center tracking-[10px] font-bold text-gray-900 dark:text-gray-100"
          />
          <TouchableOpacity
            onPress={handleVerify}
            disabled={loading}
            className={`p-4 rounded-xl items-center ${
              loading ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold uppercase tracking-widest">
                Verify
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
            <View className="bg-white dark:bg-[#1A1D27] p-2 rounded-xl shadow-lg">
              <View className="w-12 h-12 bg-blue-600 rounded-lg items-center justify-center">
                <Text className="text-white text-2xl font-bold">E</Text>
              </View>
            </View>
          </View>

          <View className="bg-white dark:bg-[#1A1D27] rounded-3xl p-8 pt-12 shadow-sm border border-gray-100 dark:border-gray-800">
            <Text className="text-2xl font-bold text-[#1a2b4b] dark:text-gray-100 text-center">
              Register
            </Text>

            <Text className="text-sm font-semibold mt-4 text-[#1a2b4b] dark:text-gray-200">
              Manage all your Et-Pulse Account
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-6 leading-5">
              Let&apos;s get you all setup, so you can verify your personal
              account and begin setting up your profile.
            </Text>

            <View className="gap-4 mb-6">
              <TextInput
                placeholder="Full Name *"
                placeholderTextColor={isDark ? "#6B7280" : "#94a3b8"}
                value={fullName}
                onChangeText={setFullName}
                autoComplete="name"
                textContentType="name"
                className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252830] rounded-xl p-4 text-sm text-gray-900 dark:text-gray-100"
              />

              <TextInput
                placeholder="Email *"
                placeholderTextColor={isDark ? "#6B7280" : "#94a3b8"}
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252830] rounded-xl p-4 text-sm text-gray-900 dark:text-gray-100"
              />

              <View className="flex-row border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252830] rounded-xl items-center overflow-hidden">
                <TextInput
                  placeholder="Password *"
                  placeholderTextColor={isDark ? "#6B7280" : "#94a3b8"}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
                  textContentType="newPassword"
                  className="flex-1 p-4 text-sm text-gray-900 dark:text-gray-100"
                />
                <TouchableOpacity
                  onPress={generatePassword}
                  className="p-3 border-l border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#1A1D27]"
                >
                  <Text className="text-lg font-bold text-gray-600 dark:text-gray-400">
                    #
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="p-3 border-l border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#1A1D27]"
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={isDark ? "#94a3b8" : "#475569"}
                  />
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Confirm Password *"
                placeholderTextColor={isDark ? "#6B7280" : "#94a3b8"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252830] rounded-xl p-4 text-sm text-gray-900 dark:text-gray-100"
              />
            </View>

            <View className="mb-6">
              <Checkbox
                checked={receiveEmails}
                onPress={() => setReceiveEmails(!receiveEmails)}
                label="Yes, I want to receive Et-Pulse community emails"
              />
              <Checkbox
                checked={agreeTerms}
                onPress={() => setAgreeTerms(!agreeTerms)}
                label="I agree to all the"
                boldLabel="Terms & Conditions and Fees."
              />
            </View>

            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              className={`p-4 rounded-xl items-center shadow-lg ${
                loading ? "bg-gray-400" : "bg-blue-600"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-xs uppercase tracking-widest">
                  CREATE ACCOUNT
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Already have an account?{" "}
              </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                    Login
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
