import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Alert } from "react-native";

export const useSignOut = () => {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    try {
      Alert.alert("Logout", "Are you sure you want to logou?", [
        { text: "Logout", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => signOut() },
      ]);
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return { handleSignOut };
};
