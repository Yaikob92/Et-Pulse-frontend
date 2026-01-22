import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSignOut } from "@/hooks/useSignOut";
import { useApiClient, userApi } from "@/utils/api";
import EditProfileModal from "./EditProfileModal";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const { handleSignOut } = useSignOut();

  const router = useRouter();
  const api = useApiClient();

  const { currentUser, refetch } = useCurrentUser();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0].uri) {
        try {
          await userApi.uploadProfilePicture(api, result.assets[0].uri);
          refetch();
          Alert.alert("Success", "Profile picture updated successfully");
        } catch (error) {
          console.error("Error uploading profile picture:", error);
          Alert.alert("Error", "Failed to upload profile picture");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  return (
    <View className="flex-1 px-2 pt-8">
      {/* Header */}
      <View>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <Text className="text-lg font-semibold">Account</Text>

          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View className="items-center my-6">
          <View className="relative">
            <Image
              source={{ uri: currentUser?.profilePicture }}
              className="w-20 h-20 rounded-full"
            />
            <TouchableOpacity
              onPress={handlePickImage}
              className="absolute bottom-0 right-0 bg-purple-500 p-1.5 rounded-full">
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-semibold">{currentUser?.firstName} {currentUser?.lastName}</Text>
          <Text className="text-gray-500 text-md">{currentUser?.email}</Text>
        </View>
      </View>

      {/* Options */}
      <View className="flex-1 bg-gray-100 rounded-2xl p-4 pt-6 gap-6">
        {/* Card 1 */}
        <View className="bg-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <TouchableOpacity
            onPress={() => setIsEditModalVisible(true)}
            className="flex-row items-center justify-between px-5 py-4">
            <View className="flex-row items-center">
              <Ionicons name="brush-outline" size={22} color="#2e5ef1" />
              <Text className="text-lg text-gray-900 ml-4">Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>


          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
            <View className="flex-row items-center">
              <Ionicons name="ban-outline" size={22} color="#2e5ef1" />
              <Text className="text-lg text-gray-900 ml-4">
                View Blocked Channels
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>


          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-done-outline" size={22} color="#2e5ef1" />
              <Text className="text-lg text-gray-900 ml-4">Task Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>


          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={22} color="#2e5ef1" />
              <Text className="text-lg text-gray-900 ml-4">Activities</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Card 2 */}
        <View className="bg-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
            <View className="flex-row items-center">
              <Ionicons name="wallet-outline" size={22} color="#2e5ef1" />
              <Text className="text-lg text-gray-900 ml-4">Wallet</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>


          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
            <View className="flex-row items-center">
              <Ionicons name="heart-outline" size={22} color="#2e5ef1" />
              <Text className="text-lg text-gray-900 ml-4">Level</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4">
            <View className="flex-row items-center">
              <Ionicons name="heart-outline" size={22} color="#2e5ef1" />
              <Text className="text-lg text-gray-900 ml-4">Favorites</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/settings")}
            className="flex-row items-center justify-between px-5 py-4">
            <View className="flex-row items-center">
              <Ionicons name="heart-outline" size={22} color="#2e5ef1" />
              <Text className="text-lg text-gray-900 ml-4">Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>

        </View>

        {/* Card 3 */}
        <View className="bg-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <TouchableOpacity className="flex-row items-center justify-between px-5 py-4" onPress={handleSignOut}>
            <View className="flex-row items-center">
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
              <Text className="text-lg text-red-500 ml-4 font-semibold">
                Logout
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

      </View>

      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        currentUser={currentUser}
        refetchCurrentUser={refetch}
      />

    </View>
  );
}
