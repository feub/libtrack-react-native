import React from "react";
import { Alert, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MyText from "./MyText";
import { useAuth } from "@/context/AuthContext";

const LogoutButton = () => {
  const { onLogout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
      Alert.alert("👋", "You have been logged out successfully.");
      router.replace("/login");
    }
  };

  return (
    <Button icon="logout" mode="outlined" onPress={handleLogout}>
      Logout
    </Button>
    // <Pressable style={styles.buttonContainer} onPress={handleLogout}>
    //   <MyText style={styles.logoutBtn}>Logout</MyText>
    //   <MaterialIcons name="logout" size={16} color="#25292e" />
    // </Pressable>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f97316",
    borderRadius: 12,
    padding: 10,
  },
  logoutBtn: {
    marginRight: 6,
    fontWeight: "bold",
  },
});
