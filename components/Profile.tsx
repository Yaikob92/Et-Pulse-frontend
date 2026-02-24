import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
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

// ─── Constants ──────────────────────────────────────────────────────────────

const AVATAR_SIZE = 88;

// ─── Sub-components ──────────────────────────────────────────────────────────

type StatItemProps = { label: string; value: string | number };
const StatItem = ({ label, value }: StatItemProps) => (
  <View className="flex-1 items-center">
    <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</Text>
    <Text className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
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
};
const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  showBorder = true,
  isDestructive = false,
}: MenuItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className={`flex-row items-center py-3.5 ${showBorder ? "border-b border-gray-50 dark:border-gray-700" : ""}`}
  >
    <View
      className={`w-[38px] h-[38px] rounded-xl items-center justify-center mr-3.5 ${isDestructive ? "bg-red-50 dark:bg-red-900/30" : "bg-blue-50 dark:bg-blue-900/20"
        }`}
    >
      {icon}
    </View>
    <View className="flex-1">
      <Text
        className={`text-[15px] font-semibold ${isDestructive ? "text-red-500" : "text-gray-800 dark:text-gray-200"
          }`}
      >
        {title}
      </Text>
      {subtitle && (
        <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</Text>
      )}
    </View>
    <Ionicons
      name="chevron-forward"
      size={16}
      color={isDestructive ? "#FCA5A5" : "#D1D5DB"}
    />
  </TouchableOpacity>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Profile() {
  const { handleSignOut } = useSignOut();
  const router = useRouter();
  const api = useApiClient();
  const { currentUser, refetch } = useCurrentUser();
  const { isDark } = useTheme();

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

  const menuSections = useMemo(
    () => [
      {
        title: "Content & Activity",
        items: [
          {
            id: "bookmarks",
            icon: <Feather name="bookmark" size={18} color="#2563EB" />,
            title: "My Bookmarks",
            subtitle: "All your saved articles",
            onPress: () => router.push("/bookmarks"),
          },
          {
            id: "activity",
            icon: <Feather name="activity" size={18} color="#2563EB" />,
            title: "Recent Activity",
            subtitle: "Comments and likes history",
            onPress: () => { },
          },
          {
            id: "blocked",
            icon: <Feather name="slash" size={18} color="#2563EB" />,
            title: "Blocked Channels",
            subtitle: "Manage your hidden content",
            onPress: () => { },
          },
        ],
      },
      {
        title: "Settings & Support",
        items: [
          {
            id: "notifications",
            icon: (
              <Ionicons
                name="notifications-outline"
                size={18}
                color="#6B7280"
              />
            ),
            title: "Notifications",
            onPress: () => router.push("/notifications"),
          },
          {
            id: "settings",
            icon: (
              <Ionicons name="settings-outline" size={18} color="#6B7280" />
            ),
            title: "Settings",
            onPress: () => router.push("/settings"),
          },
          {
            id: "help",
            icon: <Feather name="help-circle" size={18} color="#6B7280" />,
            title: "Help Center",
            onPress: () => { },
          },
          {
            id: "privacy",
            icon: <Feather name="shield" size={18} color="#6B7280" />,
            title: "Privacy & Terms",
            onPress: () => { },
          },
          {
            id: "logout",
            icon: <Feather name="log-out" size={18} color="#EF4444" />,
            title: "Log Out",
            onPress: handleSignOut,
            isDestructive: true,
            showBorder: false,
          },
        ],
      },
    ],
    [handleSignOut, router]
  );

  const avatarUri =
    currentUser?.profilePicture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${currentUser?.firstName ?? "U"} ${currentUser?.lastName ?? ""}`
    )}&background=2563EB&color=fff&size=200`;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1117]" edges={["top"]}>
      {/* ── Top Bar ── */}
      <View className="px-6 py-3.5 flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A1D27]">
        <Text className="text-[22px] font-bold text-gray-900 dark:text-gray-100">Profile</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#252830] items-center justify-center border border-gray-100 dark:border-gray-700"
          >
            <Ionicons name="notifications-outline" size={22} color={isDark ? "#D1D5DB" : "#111827"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#252830] items-center justify-center border border-gray-100 dark:border-gray-700"
          >
            <Ionicons name="settings-outline" size={22} color={isDark ? "#D1D5DB" : "#111827"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* ── Profile Card ── */}
        <View
          className="mx-5 mt-5 bg-white dark:bg-[#1A1D27] rounded-3xl pt-7 items-center"
        >
          {/* Avatar */}
          <View className="relative mb-4">
            <Image
              source={{ uri: avatarUri }}
              style={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderRadius: AVATAR_SIZE / 2,
                borderWidth: 2,
                borderColor: isDark ? "#374151" : "#E5E7EB",
              }}
              contentFit="cover"
              transition={400}
            />
            <TouchableOpacity
              onPress={handlePickImage}
              activeOpacity={0.85}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-600 items-center justify-center border-2 border-white dark:border-[#1A1D27]"
            >
              <Ionicons name="camera" size={13} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* User Meta */}
          <View className="items-center px-5 mb-6">
            <View className="flex-row items-center justify-center flex-wrap mb-1">
              <Text
                className="text-[22px] font-bold text-gray-900 dark:text-gray-100 text-center"
                numberOfLines={1}
              >
                {currentUser?.firstName} {currentUser?.lastName}
              </Text>
              {currentUser?.isVerified && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={20}
                  color="#2563EB"
                  style={{ marginLeft: 6 }}
                />
              )}
            </View>
            <Text className="text-[15px] text-gray-500 dark:text-gray-400 font-medium">
              @{currentUser?.username ?? "username"}
            </Text>
            <Text className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">
              {currentUser?.email}
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row w-full border-t border-gray-100 dark:border-gray-700 py-4">
            <StatItem label="Posts" value={currentUser?.totalPosts ?? 0} />
            <View className="w-px h-8 bg-gray-100 dark:bg-gray-700 self-center" />
            <StatItem
              label="Following"
              value={currentUser?.following?.length ?? 0}
            />
            <View className="w-px h-8 bg-gray-100 dark:bg-gray-700 self-center" />
            <StatItem label="Saved" value={bookmarks.length} />
          </View>
        </View>

        {/* ── Menu Sections ── */}
        <View className="mt-6 px-5 pb-10">
          {menuSections.map((section, idx) => (
            <View key={section.title} className={idx > 0 ? "mt-7" : ""}>
              <Text className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 ml-1">
                {section.title}
              </Text>
              <View className="bg-gray-50 dark:bg-[#1A1D27] rounded-2xl border border-gray-100 dark:border-gray-700 px-4">
                {section.items.map((item) => (
                  <MenuItem key={item.id} {...item} />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
