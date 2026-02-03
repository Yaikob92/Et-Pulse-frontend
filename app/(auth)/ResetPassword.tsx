
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useResetPassword } from '../../hooks/useResetPassword';

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

    return (
        <View style={{ flex: 1, backgroundColor: "#f3f4f7" }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }}>
                <View style={{ width: "100%", maxWidth: 400, alignSelf: "center", position: "relative" }}>

                    {/* Logo */}
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
                            borderRadius: 999,
                            shadowColor: "#000",
                            shadowOpacity: 0.2,
                            shadowRadius: 10
                        }}>
                            <Image
                                // source={require("../../assets/images/logo-abbr.png")}
                                style={{ width: 64, height: 64, borderRadius: 32 }}
                            />
                        </View>
                    </View>

                    <View style={{
                        backgroundColor: "#fff",
                        borderRadius: 24,
                        padding: 32,
                        paddingTop: 48,
                        shadowColor: "#000",
                        shadowOpacity: 0.15,
                        shadowRadius: 20
                    }}>
                        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#1a2b4b" }}>
                            {step === "request" ? "Reset" : "Reset Password"}
                        </Text>

                        <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 8, color: "#1a2b4b" }}>
                            {step === "request"
                                ? "Reset to your username"
                                : "Enter your reset code and new password"}
                        </Text>

                        <Text style={{ fontSize: 12, color: "#64748b", marginTop: 8, marginBottom: 24 }}>
                            {step === "request"
                                ? "Enter your email and a reset link will sent to you, let's access our the best recommendation for you."
                                : "Please check your email for the reset code."}
                        </Text>

                        {error ? (
                            <View style={{ backgroundColor: '#fef2f2', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#fee2e2' }}>
                                <Text style={{ color: '#dc2626', fontSize: 12, textAlign: 'center', fontWeight: '500' }}>{error}</Text>
                            </View>
                        ) : null}

                        {step === "request" && (
                            <View style={{ marginBottom: 24 }}>
                                <View style={{ position: 'absolute', left: 12, top: 16, zIndex: 1 }}>
                                    <Ionicons name="mail-outline" size={18} color="#94a3b8" />
                                </View>
                                <TextInput
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#e2e8f0",
                                        borderRadius: 16,
                                        padding: 14,
                                        paddingLeft: 40,
                                        fontSize: 14
                                    }}
                                />
                            </View>
                        )}

                        {step === "reset" && (
                            <>
                                <View style={{ marginBottom: 16 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 4 }}>
                                        <Text style={{ fontSize: 12, color: "#64748b" }}>Reset Code</Text>
                                        {timeLeft !== null && timeLeft > 0 ? (
                                            <Text style={{ fontSize: 12, color: timeLeft < 60 ? "#dc2626" : "#3b59df", fontWeight: "600" }}>
                                                Expires in: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                            </Text>
                                        ) : (
                                            <Text style={{ fontSize: 12, color: "#dc2626", fontWeight: "600" }}>Code expired</Text>
                                        )}
                                    </View>
                                    <TextInput
                                        placeholder="Reset Code"
                                        value={code}
                                        onChangeText={setCode}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#e2e8f0",
                                            borderRadius: 16,
                                            padding: 14,
                                            fontSize: 14
                                        }}
                                    />
                                </View>
                                <View style={{ marginBottom: 16 }}>
                                    <TextInput
                                        placeholder="New Password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#e2e8f0",
                                            borderRadius: 16,
                                            padding: 14,
                                            fontSize: 14
                                        }}
                                    />
                                </View>
                                <View style={{ marginBottom: 24 }}>
                                    <TextInput
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#e2e8f0",
                                            borderRadius: 16,
                                            padding: 14,
                                            fontSize: 14
                                        }}
                                    />
                                </View>
                            </>
                        )}

                        <TouchableOpacity
                            onPress={step === "request" ? onRequestReset : onResetPassword}
                            disabled={loading || (step === "reset" && timeLeft === 0)}
                            style={{
                                backgroundColor: (loading || (step === "reset" && timeLeft === 0)) ? "#94a3b8" : "#3b59df",
                                padding: 16,
                                borderRadius: 16,
                                alignItems: "center",
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 8,
                                shadowColor: "#3b59df",
                                shadowOpacity: 0.2,
                                shadowRadius: 10,
                                elevation: 5
                            }}>
                            {loading ? <ActivityIndicator color="#fff" /> : (
                                <>
                                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12, letterSpacing: 1 }}>
                                        {step === "request" ? "RESET NOW" : "SAVE NEW PASSWORD"}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={{ marginTop: 32, paddingTop: 32, borderTopWidth: 1, borderTopColor: '#f1f5f9', alignItems: 'center' }}>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text style={{ color: "#3b59df", fontWeight: "bold", fontSize: 14 }}>Back to Login</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
