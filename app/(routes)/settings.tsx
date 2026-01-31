import {
    View,
    Text,
    TouchableOpacity,
    Switch,
    ScrollView,
    Platform,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToggleItem = {
    kind: "toggle";
    id: string;
    icon: React.ReactNode;
    label: string;
    subtitle?: string;
    stateKey: keyof ToggleState;
    activeColor: string;
};

type NavItem = {
    kind: "nav";
    id: string;
    icon: React.ReactNode;
    label: string;
    subtitle?: string;
    onPress: () => void;
    isDestructive?: boolean;
};

type SettingsItem = ToggleItem | NavItem;

type Section = {
    title: string;
    items: SettingsItem[];
};

type ToggleState = {
    notifications: boolean;
    breakingNews: boolean;
    emailDigest: boolean;
    reducedMotion: boolean;
    sensitiveContent: boolean;
    autoPlayVideos: boolean;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

type RowProps = {
    item: SettingsItem;
    isLast: boolean;
    toggleState: ToggleState;
    onToggle: (key: keyof ToggleState) => void;
    isDarkMode: boolean;
    onDarkModeToggle: () => void;
};

const SettingsRow = ({ item, isLast, toggleState, onToggle, isDarkMode, onDarkModeToggle }: RowProps) => {
    const borderClass = isLast ? "" : "border-b border-gray-100 dark:border-gray-700";

    const iconBg =
        item.kind === "nav" && item.isDestructive
            ? "bg-red-50 dark:bg-red-900/30"
            : "bg-gray-100 dark:bg-gray-700";
    const iconEl = item.icon;

    // Special handling for dark mode toggle
    const isDarkModeRow = item.kind === "toggle" && item.id === "darkMode";

    return (
        <View className={`flex-row items-center px-4 py-3.5 ${borderClass}`}>
            {/* Icon */}
            <View
                className={`w-9 h-9 rounded-xl items-center justify-center mr-3.5 ${iconBg}`}
            >
                {iconEl}
            </View>

            {/* Label */}
            <View className="flex-1">
                <Text
                    className={`text-[15px] font-semibold ${item.kind === "nav" && item.isDestructive
                        ? "text-red-500"
                        : "text-gray-900 dark:text-gray-100"
                        }`}
                >
                    {item.label}
                </Text>
                {item.subtitle && (
                    <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.subtitle}</Text>
                )}
            </View>

            {/* Right control */}
            {item.kind === "toggle" ? (
                isDarkModeRow ? (
                    <Switch
                        value={isDarkMode}
                        onValueChange={onDarkModeToggle}
                        trackColor={{ false: "#E5E7EB", true: item.activeColor }}
                        thumbColor="#fff"
                        ios_backgroundColor="#E5E7EB"
                    />
                ) : (
                    <Switch
                        value={toggleState[item.stateKey]}
                        onValueChange={() => onToggle(item.stateKey)}
                        trackColor={{ false: "#E5E7EB", true: item.activeColor }}
                        thumbColor="#fff"
                        ios_backgroundColor="#E5E7EB"
                    />
                )
            ) : (
                <TouchableOpacity onPress={item.onPress} className="flex-row items-center" activeOpacity={0.7}>
                    <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={item.isDestructive ? "#FCA5A5" : "#D1D5DB"}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Settings() {
    const router = useRouter();
    const { isDark, toggleTheme } = useTheme();

    const [toggles, setToggles] = useState<ToggleState>({
        notifications: true,
        breakingNews: true,
        emailDigest: false,
        reducedMotion: false,
        sensitiveContent: false,
        autoPlayVideos: true,
    });

    const handleToggle = (key: keyof ToggleState) => {
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const sections: Section[] = [
        {
            title: "Account",
            items: [
                {
                    kind: "nav",
                    id: "account-info",
                    icon: <Feather name="user" size={16} color="#2563EB" />,
                    label: "Account Information",
                    subtitle: "Edit your personal details",
                    onPress: () => { },
                },
                {
                    kind: "nav",
                    id: "password",
                    icon: <Feather name="lock" size={16} color="#2563EB" />,
                    label: "Change Password",
                    subtitle: "Update your login credentials",
                    onPress: () => { },
                },
                {
                    kind: "nav",
                    id: "privacy",
                    icon: <Feather name="shield" size={16} color="#2563EB" />,
                    label: "Privacy & Data",
                    subtitle: "Control how your data is used",
                    onPress: () => { },
                },
                {
                    kind: "nav",
                    id: "blocked",
                    icon: <Feather name="slash" size={16} color="#2563EB" />,
                    label: "Blocked Channels",
                    subtitle: "Manage hidden content sources",
                    onPress: () => { },
                },
            ],
        },
        {
            title: "Notifications",
            items: [
                {
                    kind: "toggle",
                    id: "notifications",
                    icon: <Ionicons name="notifications-outline" size={16} color="#7C3AED" />,
                    label: "Push Notifications",
                    subtitle: "Receive alerts on your device",
                    stateKey: "notifications",
                    activeColor: "#7C3AED",
                },
                {
                    kind: "toggle",
                    id: "breaking",
                    icon: <Ionicons name="flash-outline" size={16} color="#DC2626" />,
                    label: "Breaking News",
                    subtitle: "Get notified for urgent stories",
                    stateKey: "breakingNews",
                    activeColor: "#DC2626",
                },
                {
                    kind: "toggle",
                    id: "digest",
                    icon: <Feather name="mail" size={16} color="#059669" />,
                    label: "Daily Email Digest",
                    subtitle: "Receive a daily summary via email",
                    stateKey: "emailDigest",
                    activeColor: "#059669",
                },
            ],
        },
        {
            title: "Display & Content",
            items: [
                {
                    kind: "toggle",
                    id: "darkMode",
                    icon: <Ionicons name={isDark ? "moon" : "moon-outline"} size={16} color={isDark ? "#60A5FA" : "#6B7280"} />,
                    label: "Dark Mode",
                    subtitle: isDark ? "Currently using dark theme" : "Switch to a darker theme",
                    stateKey: "reducedMotion", // unused for dark mode, handled specially
                    activeColor: "#3B82F6",
                },
                {
                    kind: "toggle",
                    id: "reducedMotion",
                    icon: <MaterialCommunityIcons name="motion-pause-outline" size={16} color="#6B7280" />,
                    label: "Reduce Motion",
                    subtitle: "Limit animation and transitions",
                    stateKey: "reducedMotion",
                    activeColor: "#6B7280",
                },
                {
                    kind: "toggle",
                    id: "autoPlay",
                    icon: <Ionicons name="play-circle-outline" size={16} color="#2563EB" />,
                    label: "Auto-Play Videos",
                    subtitle: "Videos play automatically in feed",
                    stateKey: "autoPlayVideos",
                    activeColor: "#2563EB",
                },
                {
                    kind: "toggle",
                    id: "sensitive",
                    icon: <Feather name="eye-off" size={16} color="#6B7280" />,
                    label: "Sensitive Content",
                    subtitle: "Show content with content warnings",
                    stateKey: "sensitiveContent",
                    activeColor: "#F59E0B",
                },
                {
                    kind: "nav",
                    id: "language",
                    icon: <Ionicons name="language-outline" size={16} color="#2563EB" />,
                    label: "Language",
                    subtitle: "English (US)",
                    onPress: () => { },
                },
            ],
        },
        {
            title: "About",
            items: [
                {
                    kind: "nav",
                    id: "about",
                    icon: <Ionicons name="information-circle-outline" size={16} color="#6B7280" />,
                    label: "About Et-Pulse",
                    subtitle: `Version 1.0.0 (${Platform.OS})`,
                    onPress: () => { },
                },
                {
                    kind: "nav",
                    id: "terms",
                    icon: <Feather name="file-text" size={16} color="#6B7280" />,
                    label: "Terms of Service",
                    onPress: () => { },
                },
                {
                    kind: "nav",
                    id: "feedback",
                    icon: <Feather name="message-circle" size={16} color="#6B7280" />,
                    label: "Send Feedback",
                    onPress: () => { },
                },
            ],
        },
        {
            title: "Danger Zone",
            items: [
                {
                    kind: "nav",
                    id: "deactivate",
                    icon: <Feather name="alert-circle" size={16} color="#EF4444" />,
                    label: "Deactivate Account",
                    subtitle: "Temporarily disable your account",
                    onPress: () => { },
                    isDestructive: true,
                },
                {
                    kind: "nav",
                    id: "delete",
                    icon: <Feather name="trash-2" size={16} color="#EF4444" />,
                    label: "Delete Account",
                    subtitle: "Permanently remove all your data",
                    onPress: () => { },
                    isDestructive: true,
                },
            ],
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F1117]" edges={["top"]}>
            {/* ── Header ── */}
            <View className="flex-row items-center px-5 py-4 bg-white dark:bg-[#1A1D27] border-b border-gray-100 dark:border-gray-800">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-9 h-9 rounded-full items-center justify-center bg-gray-100 dark:bg-[#252830] mr-4"
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={20} color={isDark ? "#D1D5DB" : "#111827"} />
                </TouchableOpacity>
                <Text className="flex-1 text-[20px] font-bold text-gray-900 dark:text-gray-100">Settings</Text>
            </View>

            {/* ── Content ── */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 48, paddingTop: 16 }}
            >
                {sections.map((section, sIdx) => (
                    <View key={section.title} className={sIdx > 0 ? "mt-6 px-5" : "px-5"}>
                        {/* Section Header */}
                        <Text className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2.5 ml-1">
                            {section.title}
                        </Text>

                        {/* Section Card */}
                        <View className="bg-white dark:bg-[#1A1D27] rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {section.items.map((item, iIdx) => (
                                item.kind === "toggle" ? (
                                    <SettingsRow
                                        key={item.id}
                                        item={item}
                                        isLast={iIdx === section.items.length - 1}
                                        toggleState={toggles}
                                        onToggle={handleToggle}
                                        isDarkMode={isDark}
                                        onDarkModeToggle={toggleTheme}
                                    />
                                ) : (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={item.onPress}
                                        activeOpacity={0.7}
                                    >
                                        <SettingsRow
                                            item={item}
                                            isLast={iIdx === section.items.length - 1}
                                            toggleState={toggles}
                                            onToggle={handleToggle}
                                            isDarkMode={isDark}
                                            onDarkModeToggle={toggleTheme}
                                        />
                                    </TouchableOpacity>
                                )
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
