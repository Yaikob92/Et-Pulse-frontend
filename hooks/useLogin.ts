import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";

export const useLogin = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "apple" | null
  >(null);
  const { startSSOFlow } = useSSO();

  const onSignInPress = async () => {
    if (!isLoaded) return;
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setLoadingProvider(strategy === "oauth_google" ? "google" : "apple");
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("Error in social auth", error);
      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert(
        "Error",
        `Failed to sign in with ${provider}. Please try again.`
      );
    } finally {
      setLoadingProvider(null);
    }
  };
  return {
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    onSignInPress,
    handleSocialAuth,
    loadingProvider,
  };
};
