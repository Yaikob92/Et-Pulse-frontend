
import React, { useState } from "react";
import { Alert } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { parseClerkError } from "../utils/errorParser";

export const useResetPassword = () => {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"request" | "reset">("request");
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    React.useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (step === "reset" && timeLeft !== null && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else if (timeLeft === 0) {
            setError("Reset code has expired. Please request a new one.");
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [step, timeLeft]);

    const onRequestReset = async () => {
        if (!isLoaded) return;
        setError("");
        setLoading(true);

        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: email,
            });
            setStep("reset");
            setTimeLeft(600);
        } catch (err: any) {
            console.log("Reset request error:", err);
            setError(parseClerkError(err));
        } finally {
            setLoading(false);
        }
    };

    const onResetPassword = async () => {
        if (!isLoaded) return;
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const result = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code,
                password,
            });

            if (result.status === "complete") {
                Alert.alert(
                    "Success",
                    "Your password has been reset successfully. Please login with your new password.",
                    [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
                );
            } else {
                console.log("Reset verification incomplete:", result);
                setError("Verification failed. Please try again.");
            }
        } catch (err: any) {
            console.log("Reset password error:", err);
            setError(parseClerkError(err));
        } finally {
            setLoading(false);
        }
    };

    return {
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
        setStep,
        timeLeft,
        onRequestReset,
        onResetPassword,
    };
};
