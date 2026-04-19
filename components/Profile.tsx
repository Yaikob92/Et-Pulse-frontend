import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSignOut } from "@/hooks/useSignOut";
import { useApiClient, userApi, bookmarkApi } from "@/utils/api";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

// ─── Constants ──────────────────────────────────────────────────────────────

const AVATAR_SIZE = 100;

// ─── Sub-components ──────────────────────────────────────────────────────────

type StatItemProps = { label: string; value: string | number; icon: string };
const StatItem = ({ label, value, icon }: StatItemProps) => (
  <View className="flex-1 items-center justify-center">
    <View className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl mb-1.5">
      <Ionicons name={icon as any} size={18} color="#3B82F6" />
    </View>
    <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</Text>
    <Text className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
      {label}
    </Text>
  </View>
);

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showBorder?: boolean;
  isDestructive?: boolean;
  rightElement?: React.ReactNode;
};
const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  showBorder = true,
  isDestructive = false,
  rightElement,
}: MenuItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className={`flex-row items-center py-4 ${showBorder ? "border-b border-gray-100 dark:border-gray-800" : ""}`}
  >
    <View
      className={`w-10 h-10 rounded-2xl items-center justify-center mr-4 ${isDestructive ? "bg-red-50 dark:bg-red-900/20" : "bg-blue-50 dark:bg-blue-900/20"
        }`}
    >
      {icon}
    </View>
    <View className="flex-1">
      <Text
        className={`text-[15px] font-bold ${isDestructive ? "text-red-500" : "text-gray-800 dark:text-gray-200"
          }`}
      >
        {title}
      </Text>
      {subtitle && (
        <Text className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{subtitle}</Text>
      )}
    </View>
    {rightElement ? (
      rightElement
    ) : (
      <Ionicons
        name="chevron-forward"
        size={18}
        color={isDestructive ? "#EF4444" : "#D1D5DB"}
      />
    )}
  </TouchableOpacity>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Profile() {
  const { handleSignOut } = useSignOut();
  const router = useRouter();
  const api = useApiClient();
  const { currentUser, refetch } = useCurrentUser();
  const { isDark, toggleTheme } = useTheme();

  const { data: bookmarks = [] } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      try {
        const res = await bookmarkApi.getBookMark(api);
        return res.data.bookMarks ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!currentUser,
  });

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });
      if (!result.canceled && result.assets[0].uri) {
        await userApi.uploadProfilePicture(api, result.assets[0].uri);
        refetch();
        Alert.alert("Success", "Profile picture updated");
      }
    } catch {
      Alert.alert("Error", "Failed to update profile picture");
    }
  };

  const avatarUri =
    currentUser?.profilePicture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${currentUser?.firstName ?? "U"} ${currentUser?.lastName ?? ""}`
    )}&background=2563EB&color=fff&size=200`;

  return (
    <View className="flex-1 bg-gray-50 dark:bg-[#0F1117]">
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* ── Dynamic Header & Cover ── */}
        <LinearGradient
          colors={isDark ? ["#1E3A8A", "#1e1b4b"] : ["#3B82F6", "#1D4ED8"]}
          className="h-44 w-full"
        />

        {/* ── Main Profile Content ── */}
        <View className="px-5 -mt-20">
          {/* Profile Card */}
          <View className="bg-white dark:bg-[#1A1D27] rounded-[32px] p-6 shadow-xl shadow-black/5 items-center">
            {/* Avatar Section */}
            <View className="relative -mt-16 mb-4">
              <View className="p-1 rounded-full bg-white dark:bg-[#1A1D27]">
                <Image
                  source={{ uri: avatarUri }}
                  style={{
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    borderRadius: AVATAR_SIZE / 2,
                  }}
                  contentFit="cover"
                  transition={400}
                />
              </View>
              <TouchableOpacity
                onPress={handlePickImage}
                activeOpacity={0.85}
                className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-blue-600 items-center justify-center border-4 border-white dark:border-[#1A1D27]"
              >
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Identity */}
            <View className="items-center mb-6">
              <View className="flex-row items-center mb-1">
                <Text className="text-2xl font-black text-gray-900 dark:text-gray-100">
                  {currentUser?.firstName} {currentUser?.lastName}
                </Text>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={20}
                  color="#3B82F6"
                  style={{ marginLeft: 6 }}
                />
              </View>
              <Text className="text-gray-500 dark:text-gray-400 font-semibold mb-2">
                @{currentUser?.username ?? "username"}
              </Text>
              
              <View className="flex-row bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full items-center">
                <MaterialCommunityIcons name="crown" size={14} color="#3B82F6" />
                <Text className="text-[12px] font-bold text-blue-600 dark:text-blue-400 ml-1.5 uppercase tracking-wide">
                  Pro Member
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View className="flex-row w-full pt-4 border-t border-gray-50 dark:border-gray-800">
              <StatItem label="News" value={currentUser?.totalPosts ?? 0} icon="newspaper-outline" />
              <View className="w-px h-10 bg-gray-50 dark:bg-gray-800 self-center" />
              <StatItem label="Following" value={currentUser?.following?.length ?? 0} icon="people-outline" />
              <View className="w-px h-10 bg-gray-50 dark:bg-gray-800 self-center" />
              <StatItem label="Saved" value={bookmarks.length} icon="bookmark-outline" />
            </View>
          </View>

          {/* ── App Preferences Section ── */}
          <View className="mt-8">
            <Text className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 ml-1">
              App Preferences
            </Text>
            <View className="bg-white dark:bg-[#1A1D27] rounded-3xl p-2 px-4 shadow-sm">
              <MenuItem
                icon={<Feather name="moon" size={18} color="#A78BFA" />}
                title="Dark Mode"
                subtitle="Easier on the eyes"
                onPress={() => {}}
                rightElement={
                  <Switch
                    value={isDark}
                    onValueChange={(val) => {
                      // Small delay to allow switch animation to finish before heavy re-render
                      setTimeout(() => toggleTheme(), 10);
                    }}
                    trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                    thumbColor="#fff"
                  />
                }
              />
              <MenuItem
                icon={<Feather name="bell" size={18} color="#F59E0B" />}
                title="Notifications"
                subtitle="Smart news alerts"
                onPress={() => router.push("/notifications")}
              />
            </View>
          </View>

          {/* ── Account Section ── */}
          <View className="mt-8">
            <Text className="text-[12px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 ml-1">
              Member Services
            </Text>
            <View className="bg-white dark:bg-[#1A1D27] rounded-3xl p-2 px-4 shadow-sm">
              <MenuItem
                icon={<Feather name="bookmark" size={18} color="#3B82F6" />}
                title="Saved Articles"
                onPress={() => router.push("/bookmarks")}
              />
              <MenuItem
                icon={<Feather name="settings" size={18} color="#6B7280" />}
                title="Account Settings"
                onPress={() => router.push("/settings")}
              />
              <MenuItem
                icon={<Feather name="help-circle" size={18} color="#6B7280" />}
                title="Help & Feedback"
                onPress={() => {}}
              />
              <MenuItem
                icon={<Feather name="log-out" size={18} color="#EF4444" />}
                title="Sign Out"
                onPress={handleSignOut}
                isDestructive
                showBorder={false}
              />
            </View>
          </View>

          {/* App Version Info */}
          <View className="mt-10 mb-20 items-center">
            <Text className="text-gray-400 dark:text-gray-600 font-bold text-[10px] uppercase tracking-[3px]">
              Et-Pulse Premium | v1.0.4
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
