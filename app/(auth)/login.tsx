
import { useLogin } from "@/hooks/useLogin";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
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

  const [rememberMe, setRememberMe] = React.useState(false);

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
                //   source={require("../../assets/images/logo-abbr.png")}
                // source={require("../../assets/images/logo.png")}
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
              Login
            </Text>

            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 8, color: "#1a2b4b" }}>
              Login to your account
            </Text>

            <Text style={{ fontSize: 12, color: "#64748b", marginTop: 8, marginBottom: 24 }}>
              Thank you for get back Et-Pulse news application, let's access our the best news for you.
            </Text>

            <View style={{ marginBottom: 16 }}>
              <TextInput
                placeholder="admin@etpulse.com"
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 14
                }}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <TextInput
                placeholder="••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 14
                }}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center', marginBottom: 24 }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  backgroundColor: rememberMe ? '#3b59df' : '#f1f5f9',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {rememberMe && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={{ color: "#1a2b4b", fontWeight: "500", fontSize: 14 }}>Remember Me</Text>
              </TouchableOpacity>

              <Link href="/(auth)/ResetPassword" asChild>
                <TouchableOpacity>
                  <Text style={{ color: "#3b59df", fontWeight: "600", fontSize: 14 }}>
                    Forget password?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            <TouchableOpacity
              onPress={onSignInPress}
              disabled={loadingProvider === "google" || loadingProvider === "apple"}
              style={{
                backgroundColor: "#3b59df",
                padding: 16,
                borderRadius: 8,
                alignItems: "center",
                shadowColor: "#3b59df",
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 5
              }}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>LOGIN</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 24 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: "#e5e7eb" }} />
              <Text style={{ marginHorizontal: 16, color: "#9ca3af", fontSize: 12 }}>
                OR
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: "#e5e7eb" }} />
            </View>

            <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => handleSocialAuth('oauth_google')} style={{ paddingVertical: 4, paddingHorizontal: 32, borderRadius: 6, borderWidth: 1, borderColor: '#e2e8f0' }}>
                <Image source={require("../../assets/images/google.png")} style={{ width: 40, height: 40 }} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSocialAuth('oauth_apple')} style={{ paddingVertical: 8, paddingHorizontal: 32, borderRadius: 6, borderWidth: 1, borderColor: '#e2e8f0' }}>
                <Image source={require("../../assets/images/apple.png")} style={{ width: 28, height: 28 }} resizeMode="contain" />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
              <Text style={{ color: "#64748b", fontSize: 14 }}>Don't have an account? </Text>
              <Link href="/(auth)/Register" asChild>
                <TouchableOpacity>
                  <Text style={{ color: "#1a2b4b", fontWeight: "bold", fontSize: 14 }}>Create an Account</Text>
                </TouchableOpacity>
              </Link>
            </View>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}
