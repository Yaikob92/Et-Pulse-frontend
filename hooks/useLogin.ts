import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";
import { parseClerkError } from "../utils/errorParser";

export const useLogin = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "apple" | null
  >(null);
  const { startSSOFlow } = useSSO();

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(null);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.log("SignIn incomplete:", signInAttempt);
        setError("Sign in incomplete. Please check your information.");
      }
    } catch (err: any) {
      console.log("SignIn error:", err);
      setError(parseClerkError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setLoadingProvider(strategy === "oauth_google" ? "google" : "apple");
    setError(null);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (error: any) {
      console.log("Error in social auth:", error);
      setError(parseClerkError(error));
    } finally {
      setLoadingProvider(null);
    }
  };
  return {
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    error,
    setError,
    loading,
    onSignInPress,
    handleSocialAuth,
    loadingProvider,
  };
};
