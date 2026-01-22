import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useApiClient, userApi } from "@/utils/api";

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    currentUser: any;
    refetchCurrentUser: () => void;
}

export default function EditProfileModal({
    visible,
    onClose,
    currentUser,
    refetchCurrentUser,
}: EditProfileModalProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const api = useApiClient();

    useEffect(() => {
        if (currentUser) {
            setFirstName(currentUser.firstName || "");
            setLastName(currentUser.lastName || "");
            setProfileImage(currentUser.profilePicture || null);
        }
    }, [currentUser, visible]);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setProfileImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to pick image");
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Update text fields
            await userApi.updateProfile(api, {
                firstName,
                lastName,
            });

            // Update image if changed and it's a local URI (starts with file:// or content://)
            if (
                profileImage &&
                profileImage !== currentUser.profilePicture &&
                !profileImage.startsWith("http")
            ) {
                await userApi.uploadProfilePicture(api, profileImage);
            }

            refetchCurrentUser();
            onClose();
            Alert.alert("Success", "Profile updated successfully");
        } catch (error: any) {
            console.error("Error updating profile:", error.response?.data || error);
            Alert.alert(
                "Error",
                `Failed to update profile: ${error.response?.data?.message || "Unknown error"
                }`
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl p-6 h-[85%]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold text-black">Edit Profile</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Profile Picture */}
                    <View className="items-center mb-8">
                        <View className="relative">
                            <Image
                                source={{
                                    uri:
                                        profileImage ||
                                        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
                                }}
                                className="w-32 h-32 rounded-full bg-gray-200"
                            />
                            <TouchableOpacity
                                onPress={pickImage}
                                className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-4 border-white"
                            >
                                <Ionicons name="camera" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Form Fields */}
                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-600 mb-1 ml-1">First Name</Text>
                            <TextInput
                                value={firstName}
                                onChangeText={setFirstName}
                                className="bg-gray-100 p-4 rounded-xl text-black font-semibold"
                                placeholder="First Name"
                            />
                        </View>

                        <View>
                            <Text className="text-gray-600 mb-1 ml-1">Last Name</Text>
                            <TextInput
                                value={lastName}
                                onChangeText={setLastName}
                                className="bg-gray-100 p-4 rounded-xl text-black font-semibold"
                                placeholder="Last Name"
                            />
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={isLoading}
                        className={`mt-8 bg-blue-600 p-4 rounded-xl flex-row justify-center items-center ${isLoading ? "opacity-70" : ""
                            }`}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" className="mr-2" />
                        ) : null}
                        <Text className="text-white font-bold text-lg">Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
