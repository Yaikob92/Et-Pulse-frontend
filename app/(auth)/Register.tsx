
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignup } from '../../hooks/useSignup';

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

    // UI state
    const [showPassword, setShowPassword] = React.useState(false);
    const [agreeTerms, setAgreeTerms] = React.useState(false);
    const [receiveEmails, setReceiveEmails] = React.useState(false);

    // Validation helper functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (pwd: string): { valid: boolean; message?: string } => {
        if (pwd.length < 8) {
            return { valid: false, message: "Password must be at least 8 characters long" };
        }
        if (!/[A-Z]/.test(pwd)) {
            return { valid: false, message: "Password must contain at least one uppercase letter" };
        }
        if (!/[a-z]/.test(pwd)) {
            return { valid: false, message: "Password must contain at least one lowercase letter" };
        }
        if (!/[0-9]/.test(pwd)) {
            return { valid: false, message: "Password must contain at least one number" };
        }
        return { valid: true };
    };

    const handleSignUp = async () => {
        // Clear previous errors
        setError(null);

        // Validate required fields
        if (!fullName.trim()) {
            Alert.alert("Validation Error", "Please enter your full name");
            return;
        }

        if (!emailAddress.trim()) {
            Alert.alert("Validation Error", "Please enter your email address");
            return;
        }

        if (!validateEmail(emailAddress)) {
            Alert.alert("Validation Error", "Please enter a valid email address");
            return;
        }

        if (!password) {
            Alert.alert("Validation Error", "Please enter a password");
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            Alert.alert("Validation Error", passwordValidation.message || "Invalid password");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Validation Error", "Passwords do not match");
            return;
        }

        if (!agreeTerms) {
            Alert.alert("Terms Required", "Please agree to the Terms & Conditions to continue");
            return;
        }

        // All validations passed, proceed with signup
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
        const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
        setPassword(randomPassword);
        setConfirmPassword(randomPassword);
    };

    const Checkbox = ({ checked, onPress, label, boldLabel }: { checked: boolean, onPress: () => void, label: string, boldLabel?: string }) => (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#e2e8f0',
                backgroundColor: checked ? '#3b59df' : '#f1f5f9',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10
            }}>
                {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={{ color: "#64748b", fontSize: 13, flex: 1 }}>
                {label} {boldLabel && <Text style={{ color: "#1a2b4b", fontWeight: "bold" }}>{boldLabel}</Text>}
            </Text>
        </TouchableOpacity>
    );

    // Show error alert when error state changes
    React.useEffect(() => {
        if (error) {
            Alert.alert("Error", error, [
                { text: "OK", onPress: () => setError(null) }
            ]);
        }
    }, [error]);

    if (pendingVerification) {
        return (
            <View style={{ flex: 1, backgroundColor: "#f3f4f7", justifyContent: "center", padding: 16 }}>
                <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 32, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1a2b4b", marginBottom: 16 }}>
                        Verify Email
                    </Text>
                    <Text style={{ color: "#64748b", marginBottom: 24 }}>
                        We've sent a verification code to {emailAddress}
                    </Text>
                    <TextInput
                        value={code}
                        placeholder="Enter verification code"
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        maxLength={6}
                        style={{
                            borderWidth: 1,
                            borderColor: "#e2e8f0",
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 24,
                            fontSize: 16,
                            textAlign: 'center',
                            letterSpacing: 4
                        }}
                    />
                    <TouchableOpacity
                        onPress={handleVerify}
                        disabled={loading}
                        style={{
                            backgroundColor: "#3b59df",
                            padding: 16,
                            borderRadius: 8,
                            alignItems: "center"
                        }}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "bold" }}>Verify</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#f3f4f7" }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }}>
                <View style={{ width: "100%", maxWidth: 400, alignSelf: "center", position: "relative" }}>

                    {/* Logo (Top centered, partly outside card) */}
                    <View style={{
                        position: "absolute",
                        top: -40,
                        left: "50%",
                        transform: [{ translateX: -32 }],
                        zIndex: 10
                    }}>
                        <View style={{
                            backgroundColor: "#fff",
                            padding: 8,
                            borderRadius: 12,
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 10
                        }}>
                            <View style={{ width: 48, height: 48, backgroundColor: "#3b59df", borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>E</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{
                        backgroundColor: "#fff",
                        borderRadius: 8,
                        padding: 32,
                        paddingTop: 48,
                        shadowColor: "#000",
                        shadowOpacity: 0.05,
                        shadowRadius: 20
                    }}>
                        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1a2b4b", textAlign: 'center' }}>
                            Register
                        </Text>

                        <Text style={{ fontSize: 14, fontWeight: "600", marginTop: 16, color: "#1a2b4b" }}>
                            Manage all your Et-Pulse Account
                        </Text>
                        <Text style={{ fontSize: 13, color: "#64748b", marginTop: 4, marginBottom: 24 }}>
                            Let's get you all setup, so you can verify your personal account and begin setting up your profile.
                        </Text>

                        <View style={{ gap: 16, marginBottom: 24 }}>
                            <TextInput
                                placeholder="Full Name *"
                                value={fullName}
                                onChangeText={setFullName}
                                autoComplete="name"
                                textContentType="name"
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#e2e8f0",
                                    borderRadius: 6,
                                    padding: 12,
                                    fontSize: 14
                                }}
                            />

                            <TextInput
                                placeholder="Email *"
                                value={emailAddress}
                                onChangeText={setEmailAddress}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                textContentType="emailAddress"
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#e2e8f0",
                                    borderRadius: 6,
                                    padding: 12,
                                    fontSize: 14
                                }}
                            />


                            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 6, alignItems: 'center' }}>
                                <TextInput
                                    placeholder="Password *"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoComplete="password-new"
                                    textContentType="newPassword"
                                    style={{
                                        flex: 1,
                                        padding: 12,
                                        fontSize: 14
                                    }}
                                />
                                <TouchableOpacity onPress={generatePassword} style={{ padding: 10, borderLeftWidth: 1, borderLeftColor: "#e2e8f0", backgroundColor: "#f8fafc" }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#475569" }}>#</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 10, borderLeftWidth: 1, borderLeftColor: "#e2e8f0", backgroundColor: "#f8fafc", borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
                                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#475569" />
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                placeholder="Confirm Password *"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#e2e8f0",
                                    borderRadius: 6,
                                    padding: 12,
                                    fontSize: 14
                                }}
                            />
                        </View>

                        <View style={{ marginBottom: 24 }}>
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
                            style={{
                                backgroundColor: loading ? "#94a3b8" : "#3b59df",
                                padding: 16,
                                borderRadius: 6,
                                alignItems: "center",
                                shadowColor: "#3b59df",
                                shadowOpacity: 0.2,
                                shadowRadius: 10,
                                elevation: 5
                            }}>
                            {loading ? <ActivityIndicator color="#fff" /> : (
                                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>CREATE ACCOUNT</Text>
                            )}
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
                            <Text style={{ color: "#64748b", fontSize: 14 }}>Already have an account? </Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text style={{ color: "#1a2b4b", fontWeight: "bold", fontSize: 14 }}>Login</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
