import React from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "@/hooks/useAuth";
import { Button, Colors, Text } from "react-native-ui-lib";

const LogoutButton = () => {
  const { logoutUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  return (
    <Button style={styles.buttonContainer} onPress={handleLogout}>
      <MaterialIcons name="logout" size={24} color={Colors.background} />{" "}
      <Text style={styles.logoutBtn}>Logout</Text>
    </Button>
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
    fontWeight: "bold",
    marginLeft: 6,
  },
});
