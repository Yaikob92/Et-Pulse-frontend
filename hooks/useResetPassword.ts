
import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

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
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors?.[0]?.message || "Failed to send reset email");
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
                await setActive({ session: result.createdSessionId });
                router.replace("/");
            } else {
                console.error(JSON.stringify(result, null, 2));
                setError("Verification failed. Please try again.");
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors?.[0]?.message || "Invalid or expired reset code");
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
        onRequestReset,
        onResetPassword,
    };
};
