import { useSignOut } from "@/hooks/useSignOut";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

export default function Profile() {
  const { handleSignOut } = useSignOut();
  return (
    <TouchableOpacity
      onPress={handleSignOut}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>profile</Text>
    </TouchableOpacity>
  );
}
