import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { useTheme } from "@/context/ThemeContext";

const SkeletonItem = ({
    width,
    height,
    borderRadius = 4,
}: {
    width: any;
    height: any;
    className?: string;
    borderRadius?: number;
}) => {
    const opacity = useRef(new Animated.Value(0.3)).current;
    const { isDark } = useTheme();

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, [opacity]);

    return (
        <Animated.View
            style={{
                width,
                height,
                opacity,
                backgroundColor: isDark ? "#374151" : "#E5E7EB",
                borderRadius,
            }}
        />
    );
};

export const NewsItemSkeleton = () => {
    return (
        <View className="bg-white dark:bg-[#1A1D27] border-b border-gray-400 dark:border-gray-700 pb-4 mb-3">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pt-4 mb-3">
                <View className="flex-row items-center flex-1">
                    <SkeletonItem width={44} height={44} borderRadius={22} />
                    <View className="ml-3 flex-1">
                        <View className="mb-2">
                            <SkeletonItem width="40%" height={16} />
                        </View>
                        <SkeletonItem width="20%" height={12} />
                    </View>
                </View>
            </View>

            {/* Content */}
            <View className="px-4 mb-3">
                <View className="mb-2">
                    <SkeletonItem width="100%" height={14} />
                </View>
                <View className="mb-2">
                    <SkeletonItem width="100%" height={14} />
                </View>
                <SkeletonItem width="60%" height={14} />
            </View>

            {/* Media placeholder */}
            <SkeletonItem width="100%" height={256} borderRadius={0} />

            {/* Actions */}
            <View className="flex-row items-center justify-around mt-4">
                <View className="items-center">
                    <View className="mb-1">
                        <SkeletonItem width={20} height={20} />
                    </View>
                    <SkeletonItem width={30} height={10} />
                </View>
                <View className="items-center">
                    <View className="mb-1">
                        <SkeletonItem width={20} height={20} />
                    </View>
                    <SkeletonItem width={30} height={10} />
                </View>
                <View className="items-center">
                    <View className="mb-1">
                        <SkeletonItem width={20} height={20} />
                    </View>
                    <SkeletonItem width={30} height={10} />
                </View>
                <View className="items-center">
                    <View className="mb-1">
                        <SkeletonItem width={20} height={20} />
                    </View>
                    <SkeletonItem width={30} height={10} />
                </View>
            </View>
        </View>
    );
};

export const BookMarkItemSkeleton = () => {
    return (
        <View className="bg-white dark:bg-[#1A1D27] rounded-3xl p-4 mb-4 flex-row items-center shadow-sm">
            {/* Image Section */}
            <View className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                <SkeletonItem width="100%" height="100%" borderRadius={0} />
            </View>

            {/* Content Section */}
            <View className="flex-1 ml-4 justify-between h-24">
                <View className="flex-row justify-between items-start">
                    <View className="flex-1 mr-2">
                        <View className="mb-2">
                            <SkeletonItem width="100%" height={16} />
                        </View>
                        <SkeletonItem width="80%" height={12} />
                    </View>
                    <SkeletonItem width={20} height={20} borderRadius={10} />
                </View>

                <View className="flex-row items-center">
                    <SkeletonItem width="40%" height={10} />
                    <View className="mx-2" />
                    <SkeletonItem width="20%" height={10} />
                </View>
            </View>
        </View>
    );
};

export const BookMarkListSkeleton = () => {
    return (
        <View className="flex-1 px-4">
            <BookMarkItemSkeleton />
            <BookMarkItemSkeleton />
            <BookMarkItemSkeleton />
            <BookMarkItemSkeleton />
        </View>
    );
};

export const NewsListSkeleton = () => {
    return (
        <View className="flex-1">
            <NewsItemSkeleton />
            <NewsItemSkeleton />
            <NewsItemSkeleton />
        </View>
    );
};
