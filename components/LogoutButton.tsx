import React from "react";
import { Pressable, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MyText from "./MyText";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    Alert.alert("👋", "You have been logged out successfully.");
    router.replace("/login");
  };

  return (
    <Pressable style={styles.buttonContainer} onPress={handleLogout}>
      <MyText style={styles.logoutBtn}>Logout</MyText>
      <MaterialIcons name="logout" size={16} color="#25292e" />
    </Pressable>
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
