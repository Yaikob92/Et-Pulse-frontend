import { useSignOut } from "@/hooks/useSignOut";
import { Text, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  const { handleSignOut } = useSignOut();
  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
  );
};
